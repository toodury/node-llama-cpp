import path from "path";
import { normalizeGgufDownloadUrl } from "../gguf/utils/normalizeGgufDownloadUrl.js";
import { parseModelUri } from "./parseModelUri.js";
import { isUrl } from "./isUrl.js";
export function resolveModelDestination(modelDestination, convertUrlToUri = false) {
    const parsedUri = parseModelUri(modelDestination, convertUrlToUri);
    if (parsedUri != null) {
        return {
            type: "uri",
            url: parsedUri.resolvedUrl,
            uri: parsedUri.uri,
            parsedUri
        };
    }
    else if (isUrl(modelDestination)) {
        return {
            type: "url",
            url: normalizeGgufDownloadUrl(modelDestination)
        };
    }
    try {
        return {
            type: "file",
            path: path.resolve(process.cwd(), modelDestination)
        };
    }
    catch (err) {
        throw new Error(`Invalid path: ${modelDestination}`);
    }
}
//# sourceMappingURL=resolveModelDestination.js.map