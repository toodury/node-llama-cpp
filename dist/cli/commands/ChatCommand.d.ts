import { CommandModule } from "yargs";
import { LlamaGrammar } from "../../evaluator/LlamaGrammar.js";
import { BuildGpu } from "../../bindings/types.js";
import { SpecializedChatWrapperTypeName } from "../../chatWrappers/utils/resolveChatWrapper.js";
type ChatCommand = {
    modelPath?: string;
    header?: string[];
    gpu?: BuildGpu | "auto";
    systemInfo: boolean;
    systemPrompt?: string;
    systemPromptFile?: string;
    prompt?: string;
    promptFile?: string;
    wrapper: SpecializedChatWrapperTypeName | "auto";
    noJinja?: boolean;
    contextSize?: number;
    batchSize?: number;
    flashAttention?: boolean;
    noTrimWhitespace: boolean;
    grammar: "text" | Parameters<typeof LlamaGrammar.getFor>[1];
    jsonSchemaGrammarFile?: string;
    threads?: number;
    temperature: number;
    minP: number;
    topK: number;
    topP: number;
    seed?: number;
    gpuLayers?: number;
    repeatPenalty: number;
    lastTokensRepeatPenalty: number;
    penalizeRepeatingNewLine: boolean;
    repeatFrequencyPenalty?: number;
    repeatPresencePenalty?: number;
    maxTokens: number;
    noHistory: boolean;
    environmentFunctions: boolean;
    debug: boolean;
    meter: boolean;
    printTimings: boolean;
};
export declare const ChatCommand: CommandModule<object, ChatCommand>;
export {};
