import process from "process";
import path from "path";
import { downloadFile, downloadSequence } from "ipull";
import fs from "fs-extra";
import { createSplitPartFilename, resolveSplitGgufParts } from "../gguf/utils/resolveSplitGgufParts.js";
import { getFilenameForBinarySplitGgufPartUrls, resolveBinarySplitGgufPartUrls } from "../gguf/utils/resolveBinarySplitGgufPartUrls.js";
import { cliModelsDirectory, isCI } from "../config.js";
import { safeEventCallback } from "./safeEventCallback.js";
import { resolveModelFileAccessTokensTryHeaders } from "./modelFileAccesTokens.js";
import { pushAll } from "./pushAll.js";
import { resolveModelDestination } from "./resolveModelDestination.js";
/**
 * Create a model downloader to download a model from a URI.
 * Uses [`ipull`](https://github.com/ido-pluto/ipull) to download a model file as fast as possible with parallel connections
 * and other optimizations.
 *
 * If the uri points to a `.gguf` file that is split into multiple parts (for example, `model-00001-of-00009.gguf`),
 * all the parts will be downloaded to the specified directory.
 *
 * If the uri points to a `.gguf` file that is binary split into multiple parts (for example, `model.gguf.part1of9`),
 * all the parts will be spliced into a single file and be downloaded to the specified directory.
 *
 * If the uri points to a `.gguf` file that is not split or binary spliced (for example, `model.gguf`),
 * the file will be downloaded to the specified directory.
 *
 * The supported URI schemes are:
 * - **HTTP:** `https://`, `http://`
 * - **Hugging Face:** `hf:<user>/<model>/<file-path>#<branch>` (`#<branch>` is optional)
 * @example
 * ```typescript
 * import {fileURLToPath} from "url";
 * import path from "path";
 * import {createModelDownloader, getLlama} from "node-llama-cpp";
 *
 * const __dirname = path.dirname(fileURLToPath(import.meta.url));
 *
 * const downloader = await createModelDownloader({
 *     modelUri: "https://example.com/model.gguf",
 *     dirPath: path.join(__dirname, "models")
 * });
 * const modelPath = await downloader.download();
 *
 * const llama = await getLlama();
 * const model = await llama.loadModel({
 *     modelPath
 * });
 * ```
 * @example
 * ```typescript
 * import {fileURLToPath} from "url";
 * import path from "path";
 * import {createModelDownloader, getLlama} from "node-llama-cpp";
 *
 * const __dirname = path.dirname(fileURLToPath(import.meta.url));
 *
 * const downloader = await createModelDownloader({
 *     modelUri: "hf:user/model/model-file.gguf",
 *     dirPath: path.join(__dirname, "models")
 * });
 * const modelPath = await downloader.download();
 *
 * const llama = await getLlama();
 * const model = await llama.loadModel({
 *     modelPath
 * });
 * ```
 */
export async function createModelDownloader(options) {
    const downloader = ModelDownloader._create(options);
    await downloader._init();
    return downloader;
}
/**
 * Combine multiple models downloaders to a single downloader to download everything using as much parallelism as possible.
 *
 * You can check each individual model downloader for its download progress,
 * but only the `onProgress` passed to the combined downloader will be called during the download.
 * @example
 * ```typescript
 * import {fileURLToPath} from "url";
 * import path from "path";
 * import {createModelDownloader, combineModelDownloaders, getLlama} from "node-llama-cpp";
 *
 * const __dirname = path.dirname(fileURLToPath(import.meta.url));
 *
 * const downloaders = [
 *     createModelDownloader({
 *         modelUri: "https://example.com/model1.gguf",
 *         dirPath: path.join(__dirname, "models")
 *     }),
 *     createModelDownloader({
 *         modelUri: "hf:user/model/model2.gguf",
 *         dirPath: path.join(__dirname, "models")
 *     })
 * ];
 * const combinedDownloader = await combineModelDownloaders(downloaders, {
 *     showCliProgress: true // show download progress in the CLI
 * });
 * const [
 *     model1Path,
 *     model2Path
 * ] = await combinedDownloader.download();
 *
 * const llama = await getLlama();
 * const model1 = await llama.loadModel({
 *     modelPath: model1Path!
 * });
 * const model2 = await llama.loadModel({
 *     modelPath: model2Path!
 * });
 * ```
 */
export async function combineModelDownloaders(downloaders, options) {
    const downloader = CombinedModelDownloader._create(await Promise.all(downloaders), options);
    await downloader._init();
    return downloader;
}
export class ModelDownloader {
    /** @internal */ _modelUrl;
    /** @internal */ _dirPath;
    /** @internal */ _fileName;
    /** @internal */ _headers;
    /** @internal */ _showCliProgress;
    /** @internal */ _onProgress;
    /** @internal */ _tokens;
    /** @internal */ _deleteTempFileOnCancel;
    /** @internal */ _skipExisting;
    /** @internal */ _parallelDownloads;
    /** @internal */ _specificFileDownloaders = [];
    /** @internal */ _downloader;
    /** @internal */ _entrypointFilename;
    /** @internal */ _splitBinaryParts;
    /** @internal */ _totalFiles;
    /** @internal */ _tryHeaders = [];
    constructor(options) {
        const { modelUri, modelUrl, dirPath = cliModelsDirectory, fileName, headers, showCliProgress = false, onProgress, deleteTempFileOnCancel = true, skipExisting = true, parallelDownloads = 4, tokens } = options;
        const resolvedModelUri = modelUri || modelUrl;
        if (resolvedModelUri == null || dirPath == null)
            throw new Error("modelUri and dirPath cannot be null");
        const resolvedModelDestination = resolveModelDestination(resolvedModelUri);
        this._modelUrl = resolvedModelDestination.type === "file"
            ? path.join(dirPath, resolvedModelUri)
            : resolvedModelDestination.url;
        this._dirPath = path.resolve(process.cwd(), dirPath);
        this._fileName = fileName || (resolvedModelDestination.type === "uri"
            ? resolvedModelDestination.parsedUri.fullFilename
            : undefined);
        this._headers = headers;
        this._showCliProgress = showCliProgress;
        this._onProgress = safeEventCallback(onProgress);
        this._deleteTempFileOnCancel = deleteTempFileOnCancel;
        this._skipExisting = skipExisting;
        this._parallelDownloads = parallelDownloads;
        this._tokens = tokens;
        this._onDownloadProgress = this._onDownloadProgress.bind(this);
    }
    /**
     * The filename of the entrypoint file that should be used to load the model.
     */
    get entrypointFilename() {
        return this._entrypointFilename;
    }
    /**
     * The full path to the entrypoint file that should be used to load the model.
     */
    get entrypointFilePath() {
        return path.join(this._dirPath, this.entrypointFilename);
    }
    /**
     * If the model is binary spliced from multiple parts, this will return the number of those binary parts.
     */
    get splitBinaryParts() {
        return this._splitBinaryParts;
    }
    /**
     * The total number of files that will be saved to the directory.
     * For split files, this will be the number of split parts, as multiple files will be saved.
     * For binary-split files, this will be 1, as the parts will be spliced into a single file.
     */
    get totalFiles() {
        return this._totalFiles;
    }
    get totalSize() {
        return this._specificFileDownloaders
            .map((downloader) => downloader.status.totalBytes)
            .reduce((acc, totalBytes) => acc + totalBytes, 0);
    }
    get downloadedSize() {
        return this._specificFileDownloaders
            .map((downloader) => downloader.status.transferredBytes)
            .reduce((acc, transferredBytes) => acc + transferredBytes, 0);
    }
    /**
     * @returns The path to the entrypoint file that should be used to load the model
     */
    async download({ signal } = {}) {
        if (signal?.aborted)
            throw signal.reason;
        const onAbort = () => {
            signal?.removeEventListener("abort", onAbort);
            this.cancel();
        };
        if (signal != null)
            signal.addEventListener("abort", onAbort);
        try {
            if (this._onProgress)
                this._downloader.on("progress", this._onDownloadProgress);
            await this._downloader.download();
        }
        catch (err) {
            if (signal?.aborted)
                throw signal.reason;
            throw err;
        }
        finally {
            if (this._onProgress)
                this._downloader.off("progress", this._onDownloadProgress);
            if (signal != null)
                signal.removeEventListener("abort", onAbort);
        }
        return this.entrypointFilePath;
    }
    async cancel({ deleteTempFile = this._deleteTempFileOnCancel } = {}) {
        for (const downloader of this._specificFileDownloaders) {
            if (deleteTempFile)
                await downloader.closeAndDeleteFile();
            else
                await downloader.close();
        }
        if (this._downloader !== this._specificFileDownloaders[0])
            await this._downloader?.close();
    }
    /** @internal */
    _onDownloadProgress() {
        this._onProgress?.({
            totalSize: this.totalSize,
            downloadedSize: this.downloadedSize
        });
    }
    /** @internal */
    async resolveTryHeaders() {
        if (this._tokens == null)
            return;
        pushAll(this._tryHeaders, await resolveModelFileAccessTokensTryHeaders(this._modelUrl, this._tokens, this._headers));
    }
    /** @internal */
    async _init() {
        await this.resolveTryHeaders();
        const binarySplitPartUrls = resolveBinarySplitGgufPartUrls(this._modelUrl);
        await fs.ensureDir(this._dirPath);
        if (binarySplitPartUrls instanceof Array) {
            this._downloader = await downloadFile({
                partURLs: binarySplitPartUrls,
                directory: this._dirPath,
                fileName: this._fileName ?? getFilenameForBinarySplitGgufPartUrls(binarySplitPartUrls),
                cliProgress: this._showCliProgress,
                cliStyle: isCI ? "ci" : "fancy",
                headers: this._headers ?? {},
                tryHeaders: this._tryHeaders.slice(),
                skipExisting: this._skipExisting
            });
            this._specificFileDownloaders.push(this._downloader);
            this._entrypointFilename = this._downloader.fileName;
            this._splitBinaryParts = binarySplitPartUrls.length;
            this._totalFiles = 1;
            if (this._downloader.fileName == null || this._downloader.fileName === "")
                throw new Error("Failed to get the file name from the given URL");
            return;
        }
        const splitGgufPartUrls = resolveSplitGgufParts(this._modelUrl);
        if (splitGgufPartUrls.length === 1) {
            this._downloader = await downloadFile({
                url: splitGgufPartUrls[0],
                directory: this._dirPath,
                fileName: this._fileName ?? undefined,
                cliProgress: this._showCliProgress,
                cliStyle: isCI ? "ci" : "fancy",
                headers: this._headers ?? {},
                tryHeaders: this._tryHeaders.slice(),
                skipExisting: this._skipExisting
            });
            this._specificFileDownloaders.push(this._downloader);
            this._entrypointFilename = this._downloader.fileName;
            this._totalFiles = 1;
            if (this._downloader.fileName == null || this._downloader.fileName === "")
                throw new Error("Failed to get the file name from the given URL");
            return;
        }
        const partDownloads = splitGgufPartUrls.map((url, index) => downloadFile({
            url,
            directory: this._dirPath,
            fileName: this._fileName != null
                ? createSplitPartFilename(this._fileName, index + 1, splitGgufPartUrls.length)
                : undefined,
            headers: this._headers ?? {},
            tryHeaders: this._tryHeaders.slice(),
            skipExisting: this._skipExisting
        }));
        this._downloader = await downloadSequence({
            cliProgress: this._showCliProgress,
            cliStyle: isCI ? "ci" : "fancy",
            parallelDownloads: this._parallelDownloads
        }, ...partDownloads);
        const firstDownload = await partDownloads[0];
        this._specificFileDownloaders = await Promise.all(partDownloads);
        this._entrypointFilename = firstDownload.fileName;
        this._totalFiles = partDownloads.length;
        if (this._entrypointFilename == null || this._entrypointFilename === "")
            throw new Error("Failed to get the file name from the given URL");
        return;
    }
    /** @internal */
    static _create(options) {
        return new ModelDownloader(options);
    }
}
export class CombinedModelDownloader {
    /** @internal */ _downloaders;
    /** @internal */ _showCliProgress;
    /** @internal */ _onProgress;
    /** @internal */ _parallelDownloads;
    /** @internal */ _lock = {};
    /** @internal */ _downloader;
    /**
     * When combining `ModelDownloader` instances, the following options on each individual `ModelDownloader` are ignored:
     * - `showCliProgress`
     * - `onProgress`
     * - `parallelDownloads`
     *
     * To set any of those options for the combined downloader, you have to pass them to the combined downloader instance
     */
    constructor(downloaders, options) {
        const { showCliProgress = false, onProgress, parallelDownloads = 4 } = options ?? {};
        this._downloaders = Object.freeze(downloaders);
        this._showCliProgress = showCliProgress;
        this._onProgress = onProgress;
        this._parallelDownloads = parallelDownloads;
        this._onDownloadProgress = this._onDownloadProgress.bind(this);
    }
    async cancel() {
        for (const modelDownloader of await Promise.all(this._downloaders)) {
            if (modelDownloader._specificFileDownloaders.every((downloader) => downloader.status.downloadStatus === "Finished"))
                continue;
            for (const downloader of modelDownloader._specificFileDownloaders) {
                if (modelDownloader._deleteTempFileOnCancel)
                    await downloader.closeAndDeleteFile();
                else
                    await downloader.close();
            }
        }
    }
    /**
     * @returns The paths to the entrypoint files that should be used to load the models
     */
    async download({ signal } = {}) {
        if (signal?.aborted)
            throw signal.reason;
        const onAbort = () => {
            signal?.removeEventListener("abort", onAbort);
            this.cancel();
        };
        if (signal != null)
            signal.addEventListener("abort", onAbort);
        try {
            if (this._onProgress)
                this._downloader.on("progress", this._onDownloadProgress);
            await this._downloader.download();
        }
        catch (err) {
            if (signal?.aborted)
                throw signal.reason;
            throw err;
        }
        finally {
            if (this._onProgress)
                this._downloader.off("progress", this._onDownloadProgress);
            if (signal != null)
                signal.removeEventListener("abort", onAbort);
        }
        return this.entrypointFilePaths;
    }
    get modelDownloaders() {
        return this._downloaders;
    }
    /**
     * The filename of the entrypoint files that should be used to load the models.
     */
    get entrypointFilenames() {
        return this._downloaders.map((downloader) => downloader.entrypointFilename);
    }
    /**
     * The full paths to the entrypoint files that should be used to load the models.
     */
    get entrypointFilePaths() {
        return this._downloaders.map((downloader) => downloader.entrypointFilePath);
    }
    /**
     * The accumulation of `totalFiles` of all the model downloaders
     */
    get totalFiles() {
        return this._downloaders
            .map((downloader) => downloader.totalFiles)
            .reduce((acc, totalFiles) => acc + totalFiles, 0);
    }
    get totalSize() {
        return this._downloaders
            .map((downloader) => downloader.totalSize)
            .reduce((acc, totalBytes) => acc + totalBytes, 0);
    }
    get downloadedSize() {
        return this._downloaders
            .map((downloader) => downloader.downloadedSize)
            .reduce((acc, transferredBytes) => acc + transferredBytes, 0);
    }
    /** @internal */
    _onDownloadProgress() {
        this._onProgress?.({
            totalSize: this.totalSize,
            downloadedSize: this.downloadedSize
        });
    }
    /** @internal */
    async _init() {
        this._downloader = await downloadSequence({
            cliProgress: this._showCliProgress,
            cliStyle: isCI ? "ci" : "fancy",
            parallelDownloads: this._parallelDownloads
        }, ...(await Promise.all(this._downloaders)).flatMap((downloader) => downloader._specificFileDownloaders));
    }
    /** @internal */
    static _create(downloaders, options) {
        return new CombinedModelDownloader(downloaders, options);
    }
}
//# sourceMappingURL=createModelDownloader.js.map