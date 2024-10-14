import { ParseModelUri } from "./parseModelUri.js";
export type ResolveModelDestination = {
    type: "url";
    url: string;
} | {
    type: "uri";
    url: string;
    uri: string;
    parsedUri: ParseModelUri;
} | {
    type: "file";
    path: string;
};
export declare function resolveModelDestination(modelDestination: string, convertUrlToUri?: boolean): ResolveModelDestination;
