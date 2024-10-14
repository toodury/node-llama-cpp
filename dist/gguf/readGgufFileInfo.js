import { isUrl } from "../utils/isUrl.js";
import { isModelUri, parseModelUri } from "../utils/parseModelUri.js";
import { parseGguf } from "./parser/parseGguf.js";
import { GgufNetworkFetchFileReader } from "./fileReaders/GgufNetworkFetchFileReader.js";
import { GgufFsFileReader } from "./fileReaders/GgufFsFileReader.js";
import { ggufDefaultFetchRetryOptions } from "./consts.js";
import { normalizeGgufDownloadUrl } from "./utils/normalizeGgufDownloadUrl.js";
import { resolveSplitGgufParts } from "./utils/resolveSplitGgufParts.js";
/**
 * Read a GGUF file and return its metadata and tensor info (unless `readTensorInfo` is set to `false`).
 * Only the parts of the file required for the metadata and tensor info are read.
 * @param pathOrUri
 * @param options
 */
export async function readGgufFileInfo(pathOrUri, { readTensorInfo = true, sourceType, ignoreKeys = [], logWarnings = true, fetchRetryOptions = ggufDefaultFetchRetryOptions, fetchHeaders = {}, spliceSplitFiles = true, signal, tokens } = {}) {
    const useNetworkReader = sourceType === "network" || (sourceType == null && (isUrl(pathOrUri) || isModelUri(pathOrUri)));
    function createFileReader(pathOrUri) {
        if (useNetworkReader) {
            const parsedModelUri = parseModelUri(pathOrUri);
            return new GgufNetworkFetchFileReader({
                url: parsedModelUri?.resolvedUrl ?? normalizeGgufDownloadUrl(pathOrUri),
                retryOptions: fetchRetryOptions,
                headers: fetchHeaders,
                signal,
                tokens
            });
        }
        else if (sourceType === "filesystem" || sourceType == null) {
            return new GgufFsFileReader({
                filePath: pathOrUri,
                signal
            });
        }
        void sourceType;
        throw new Error(`Unsupported sourceType: ${sourceType}`);
    }
    async function readSingleFile(pathOrUri) {
        const fileReader = createFileReader(pathOrUri);
        return await parseGguf({
            fileReader,
            ignoreKeys,
            readTensorInfo,
            logWarnings
        });
    }
    if (!spliceSplitFiles)
        return await readSingleFile(pathOrUri);
    const allSplitPartPaths = resolveSplitGgufParts(pathOrUri);
    if (allSplitPartPaths.length === 1)
        return await readSingleFile(allSplitPartPaths[0]);
    const [first, ...rest] = await Promise.all(allSplitPartPaths.map((partPath) => readSingleFile(partPath)));
    if (first == null)
        throw new Error("First part of the split GGUF file is missing");
    return {
        version: first.version,
        tensorCount: first.tensorCount,
        metadata: first.metadata,
        architectureMetadata: first.architectureMetadata,
        tensorInfo: first.tensorInfo,
        metadataSize: first.metadataSize,
        splicedParts: allSplitPartPaths.length,
        totalTensorInfoSize: first.totalTensorInfoSize == null
            ? undefined
            : (first.totalTensorInfoSize + rest.reduce((acc, part) => (acc + (part.totalTensorInfoSize ?? 0)), 0)),
        totalTensorCount: Number(first.totalTensorCount) + rest.reduce((acc, part) => acc + Number(part.totalTensorCount), 0),
        totalMetadataSize: first.totalMetadataSize + rest.reduce((acc, part) => acc + part.totalMetadataSize, 0),
        fullTensorInfo: first.fullTensorInfo == null
            ? undefined
            : [first, ...rest].flatMap(part => (part.fullTensorInfo ?? [])),
        tensorInfoSize: first.tensorInfoSize
    };
}
//# sourceMappingURL=readGgufFileInfo.js.map