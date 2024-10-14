export type ModelFileAccessTokens = {
    huggingFace?: string;
};
export declare function resolveModelFileAccessTokensTryHeaders(modelUrl: string, tokens?: ModelFileAccessTokens, baseHeaders?: Record<string, string>): Promise<Record<string, string>[]>;
