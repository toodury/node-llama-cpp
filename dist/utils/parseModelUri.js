import filenamify from "filenamify";
import { normalizeGgufDownloadUrl } from "../gguf/utils/normalizeGgufDownloadUrl.js";
import { getFilenameForBinarySplitGgufPartUrls, resolveBinarySplitGgufPartUrls } from "../gguf/utils/resolveBinarySplitGgufPartUrls.js";
import { getGgufSplitPartsInfo } from "../gguf/utils/resolveSplitGgufParts.js";
import { isUrl } from "./isUrl.js";
const defaultHuggingFaceBranch = "main";
export function parseModelUri(urlOrUri, convertUrlToSupportedUri = false) {
    if (urlOrUri.startsWith("hf:"))
        return parseHuggingFaceUriContent(urlOrUri.slice("hf:".length));
    else if (urlOrUri.startsWith("huggingface:"))
        return parseHuggingFaceUriContent(urlOrUri.slice("huggingface:".length));
    if (convertUrlToSupportedUri && isUrl(urlOrUri)) {
        const parsedUrl = new URL(normalizeGgufDownloadUrl(urlOrUri));
        if (parsedUrl.hostname === "huggingface.co") {
            const pathnameParts = parsedUrl.pathname.split("/");
            const [, user, model, resolve, branch, ...pathParts] = pathnameParts;
            const filePath = pathParts.join("/");
            if (user != null && model != null && resolve === "resolve" && branch != null && filePath !== "") {
                return parseHuggingFaceUriContent([
                    decodeURIComponent(user),
                    "/", decodeURIComponent(model), "/",
                    filePath
                        .split("/")
                        .map((part) => decodeURIComponent(part))
                        .join("/"),
                    branch !== defaultHuggingFaceBranch
                        ? `#${decodeURIComponent(branch)}`
                        : ""
                ].join(""));
            }
        }
    }
    return null;
}
export function isModelUri(modelUri) {
    try {
        return parseModelUri(modelUri) != null;
    }
    catch {
        return false;
    }
}
function parseHuggingFaceUriContent(uri) {
    const [user, model, ...pathParts] = uri.split("/");
    let rest = pathParts.join("/");
    const hashIndex = rest.indexOf("#");
    let branch = defaultHuggingFaceBranch;
    if (hashIndex >= 0) {
        branch = rest.slice(hashIndex + "#".length);
        rest = rest.slice(0, hashIndex);
        if (branch === "")
            branch = defaultHuggingFaceBranch;
    }
    const filePathParts = rest.split("/");
    const filePath = filePathParts
        .map((part) => encodeURIComponent(part))
        .join("/");
    if (!user || !model || filePath === "")
        throw new Error(`Invalid Hugging Face URI: ${uri}`);
    const resolvedUrl = normalizeGgufDownloadUrl([
        "https://huggingface.co/", encodeURIComponent(user),
        "/", encodeURIComponent(model),
        "/resolve/", encodeURIComponent(branch),
        "/", filePath, "?download=true"
    ].join(""));
    function buildFilePrefix(user, model, branch, pathParts, filename) {
        const res = ["hf"];
        res.push(filenamify(user));
        if (!doesFilenameMatchExactModelName(filename, model) || branch !== defaultHuggingFaceBranch)
            res.push(filenamify(model));
        if (branch !== defaultHuggingFaceBranch)
            res.push(filenamify(branch));
        if (pathParts.length > 0) {
            if (doesFilenameMatchExactFolderName(filename, pathParts.at(-1)))
                pathParts = pathParts.slice(0, -1);
            if (pathParts.length > 0)
                res.push(filenamify(pathParts.join("__")));
        }
        return res.join("_") + "_";
    }
    const filename = resolveModelFilenameFromUrl(resolvedUrl);
    const filePrefix = buildFilePrefix(user, model, branch, filePathParts.slice(0, -1), filename);
    return {
        uri: `hf:${user}/${model}/${filePathParts.join("/")}${branch !== defaultHuggingFaceBranch ? `#${branch}` : ""}`,
        resolvedUrl,
        filePrefix,
        filename,
        fullFilename: `${filePrefix}${filename}`
    };
}
function resolveModelFilenameFromUrl(modelUrl) {
    const binarySplitPartUrls = resolveBinarySplitGgufPartUrls(modelUrl);
    if (binarySplitPartUrls instanceof Array)
        return getFilenameForBinarySplitGgufPartUrls(binarySplitPartUrls);
    const parsedUrl = new URL(modelUrl);
    const ggufIndex = parsedUrl.pathname.toLowerCase().indexOf(".gguf");
    const urlWithoutPart = parsedUrl.pathname.slice(0, ggufIndex + ".gguf".length);
    const filename = decodeURIComponent(urlWithoutPart.split("/").pop());
    return filenamify(filename);
}
function doesFilenameMatchExactModelName(filename, modelName) {
    if (!modelName.toLowerCase().endsWith("-gguf") || !filename.toLowerCase().endsWith(".gguf"))
        return false;
    const modelNameWithoutGguf = modelName.slice(0, -"-gguf".length);
    const filenameWithoutGguf = filename.slice(0, -".gguf".length);
    if (filenameWithoutGguf.toLowerCase().startsWith(modelNameWithoutGguf.toLowerCase()))
        return true;
    const splitPartsInfo = getGgufSplitPartsInfo(filename);
    if (splitPartsInfo == null)
        return false;
    const { matchLength } = splitPartsInfo;
    const filenameWithoutGgufAndWithoutSplitParts = filename.slice(0, filename.length - matchLength);
    return filenameWithoutGgufAndWithoutSplitParts.toLowerCase().startsWith(modelNameWithoutGguf.toLowerCase());
}
function doesFilenameMatchExactFolderName(filename, folderName) {
    if (!filename.toLowerCase().endsWith(".gguf"))
        return false;
    const filenameWithoutGguf = filename.slice(0, -".gguf".length);
    if (folderName.toLowerCase() === filenameWithoutGguf.toLowerCase())
        return true;
    const splitPartsInfo = getGgufSplitPartsInfo(filename);
    if (splitPartsInfo == null)
        return false;
    const { matchLength } = splitPartsInfo;
    const filenameWithoutGgufAndWithoutSplitParts = filename.slice(0, filename.length - matchLength);
    return folderName.toLowerCase() === filenameWithoutGgufAndWithoutSplitParts.toLowerCase();
}
//# sourceMappingURL=parseModelUri.js.map