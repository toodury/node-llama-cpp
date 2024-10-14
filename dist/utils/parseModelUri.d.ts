export type ParseModelUri = {
    uri: string;
    resolvedUrl: string;
    filePrefix: string;
    filename: string;
    fullFilename: string;
};
export declare function parseModelUri(urlOrUri: string, convertUrlToSupportedUri?: boolean): ParseModelUri | null;
export declare function isModelUri(modelUri: string): boolean;
