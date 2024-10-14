import { ChatWrapper } from "../ChatWrapper.js";
import { ChatHistoryItem, ChatWrapperGenerateContextStateOptions, ChatWrapperGeneratedContextState, ChatWrapperGenerateInitialHistoryOptions, ChatWrapperSettings } from "../types.js";
export declare class MistralChatWrapper extends ChatWrapper {
    readonly wrapperName: string;
    readonly settings: ChatWrapperSettings;
    constructor({ addSpaceBeforeEos }?: {
        /**
         * Default to `true`
         */
        addSpaceBeforeEos?: boolean;
    });
    addAvailableFunctionsSystemMessageToHistory(history: readonly ChatHistoryItem[]): readonly ChatHistoryItem[];
    generateContextState({ chatHistory, availableFunctions, documentFunctionParams }: ChatWrapperGenerateContextStateOptions): ChatWrapperGeneratedContextState;
    generateInitialChatHistory({ systemPrompt }?: ChatWrapperGenerateInitialHistoryOptions): ChatHistoryItem[];
}
