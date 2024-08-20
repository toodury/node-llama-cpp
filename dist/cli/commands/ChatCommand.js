"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCommand = void 0;
const readline = __importStar(require("readline"));
const process_1 = __importDefault(require("process"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const withOra_js_1 = __importDefault(require("../../utils/withOra.js"));
const config_js_1 = require("../../config.js");
const LlamaChatPromptWrapper_js_1 = require("../../chatWrappers/LlamaChatPromptWrapper.js");
const GeneralChatPromptWrapper_js_1 = require("../../chatWrappers/GeneralChatPromptWrapper.js");
const ChatMLChatPromptWrapper_js_1 = require("../../chatWrappers/ChatMLChatPromptWrapper.js");
const createChatWrapperByBos_js_1 = require("../../chatWrappers/createChatWrapperByBos.js");
const FalconChatPromptWrapper_js_1 = require("../../chatWrappers/FalconChatPromptWrapper.js");
const state_js_1 = require("../../state.js");
const ReplHistory_js_1 = require("../../utils/ReplHistory.js");
const modelWrappers = ["auto", "general", "llamaChat", "chatML", "falconChat"];
exports.ChatCommand = {
    command: "chat",
    describe: "Chat with a Llama model",
    builder(yargs) {
        const isInDocumentationMode = (0, state_js_1.getIsInDocumentationMode)();
        return yargs
            .option("model", {
            alias: "m",
            type: "string",
            demandOption: true,
            description: "Llama model file to use for the chat",
            group: "Required:"
        })
            .option("systemInfo", {
            alias: "i",
            type: "boolean",
            default: false,
            description: "Print llama.cpp system info",
            group: "Optional:"
        })
            .option("printTimings", {
            type: "boolean",
            default: false,
            description: "Print llama.cpp timings",
            group: "Optional:"
        })
            .option("systemPrompt", {
            alias: "s",
            type: "string",
            default: config_js_1.defaultChatSystemPrompt,
            defaultDescription: " ",
            description: "System prompt to use against the model" +
                (isInDocumentationMode ? "" : (". [default value: " + config_js_1.defaultChatSystemPrompt.split("\n").join(" ") + "]")),
            group: "Optional:"
        })
            .option("prompt", {
            type: "string",
            description: "First prompt to automatically send to the model when starting the chat",
            group: "Optional:"
        })
            .option("wrapper", {
            alias: "w",
            type: "string",
            default: "general",
            choices: modelWrappers,
            description: "Chat wrapper to use. Use `auto` to automatically select a wrapper based on the model's BOS token",
            group: "Optional:"
        })
            .option("contextSize", {
            alias: "c",
            type: "number",
            default: 1024 * 4,
            description: "Context size to use for the model",
            group: "Optional:"
        })
            .option("grammar", {
            alias: "g",
            type: "string",
            default: "text",
            choices: ["text", "json", "list", "arithmetic", "japanese", "chess"],
            description: "Restrict the model response to a specific grammar, like JSON for example",
            group: "Optional:"
        })
            .option("jsonSchemaGrammarFile", {
            alias: ["jsgf"],
            type: "string",
            description: "File path to a JSON schema file, to restrict the model response to only generate output that conforms to the JSON schema",
            group: "Optional:"
        })
            .option("threads", {
            type: "number",
            default: 6,
            description: "Number of threads to use for the evaluation of tokens",
            group: "Optional:"
        })
            .option("temperature", {
            alias: "t",
            type: "number",
            default: 0,
            description: "Temperature is a hyperparameter that controls the randomness of the generated text. It affects the probability distribution of the model's output tokens. A higher temperature (e.g., 1.5) makes the output more random and creative, while a lower temperature (e.g., 0.5) makes the output more focused, deterministic, and conservative. The suggested temperature is 0.8, which provides a balance between randomness and determinism. At the extreme, a temperature of 0 will always pick the most likely next token, leading to identical outputs in each run. Set to `0` to disable.",
            group: "Optional:"
        })
            .option("topK", {
            alias: "k",
            type: "number",
            default: 40,
            description: "Limits the model to consider only the K most likely next tokens for sampling at each step of sequence generation. An integer number between `1` and the size of the vocabulary. Set to `0` to disable (which uses the full vocabulary). Only relevant when `temperature` is set to a value greater than 0.",
            group: "Optional:"
        })
            .option("topP", {
            alias: "p",
            type: "number",
            default: 0.95,
            description: "Dynamically selects the smallest set of tokens whose cumulative probability exceeds the threshold P, and samples the next token only from this set. A float number between `0` and `1`. Set to `1` to disable. Only relevant when `temperature` is set to a value greater than `0`.",
            group: "Optional:"
        })
            .option("gpuLayers", {
            alias: "gl",
            type: "number",
            description: "number of layers to store in VRAM",
            group: "Optional:"
        })
            .option("repeatPenalty", {
            alias: "rp",
            type: "number",
            default: 1.1,
            description: "Prevent the model from repeating the same token too much. Set to `1` to disable.",
            group: "Optional:"
        })
            .option("lastTokensRepeatPenalty", {
            alias: "rpn",
            type: "number",
            default: 64,
            description: "Number of recent tokens generated by the model to apply penalties to repetition of",
            group: "Optional:"
        })
            .option("penalizeRepeatingNewLine", {
            alias: "rpnl",
            type: "boolean",
            default: true,
            description: "Penalize new line tokens. set \"--no-penalizeRepeatingNewLine\" or \"--no-rpnl\" to disable",
            group: "Optional:"
        })
            .option("repeatFrequencyPenalty", {
            alias: "rfp",
            type: "number",
            description: "For n time a token is in the `punishTokens` array, lower its probability by `n * repeatFrequencyPenalty`. Set to a value between `0` and `1` to enable.",
            group: "Optional:"
        })
            .option("repeatPresencePenalty", {
            alias: "rpp",
            type: "number",
            description: "Lower the probability of all the tokens in the `punishTokens` array by `repeatPresencePenalty`. Set to a value between `0` and `1` to enable.",
            group: "Optional:"
        })
            .option("maxTokens", {
            alias: "mt",
            type: "number",
            default: 0,
            description: "Maximum number of tokens to generate in responses. Set to `0` to disable. Set to `-1` to set to the context size",
            group: "Optional:"
        })
            .option("noHistory", {
            alias: "nh",
            type: "boolean",
            default: false,
            description: "Don't load or save chat history",
            group: "Optional:"
        });
    },
    async handler({ model, systemInfo, systemPrompt, prompt, wrapper, contextSize, grammar, jsonSchemaGrammarFile, threads, temperature, topK, topP, gpuLayers, repeatPenalty, lastTokensRepeatPenalty, penalizeRepeatingNewLine, repeatFrequencyPenalty, repeatPresencePenalty, maxTokens, noHistory, printTimings }) {
        try {
            await RunChat({
                model, systemInfo, systemPrompt, prompt, wrapper, contextSize, grammar, jsonSchemaGrammarFile, threads, temperature, topK,
                topP, gpuLayers, lastTokensRepeatPenalty, repeatPenalty, penalizeRepeatingNewLine, repeatFrequencyPenalty,
                repeatPresencePenalty, maxTokens, noHistory, printTimings
            });
        }
        catch (err) {
            console.error(err);
            process_1.default.exit(1);
        }
    }
};
async function RunChat({ model: modelArg, systemInfo, systemPrompt, prompt, wrapper, contextSize, grammar: grammarArg, jsonSchemaGrammarFile: jsonSchemaGrammarFilePath, threads, temperature, topK, topP, gpuLayers, lastTokensRepeatPenalty, repeatPenalty, penalizeRepeatingNewLine, repeatFrequencyPenalty, repeatPresencePenalty, maxTokens, noHistory, printTimings }) {
    const { LlamaChatSession } = await Promise.resolve().then(() => __importStar(require("../../llamaEvaluator/LlamaChatSession.js")));
    const { LlamaModel } = await Promise.resolve().then(() => __importStar(require("../../llamaEvaluator/LlamaModel.js")));
    const { LlamaContext } = await Promise.resolve().then(() => __importStar(require("../../llamaEvaluator/LlamaContext.js")));
    const { LlamaGrammar } = await Promise.resolve().then(() => __importStar(require("../../llamaEvaluator/LlamaGrammar.js")));
    const { LlamaJsonSchemaGrammar } = await Promise.resolve().then(() => __importStar(require("../../llamaEvaluator/LlamaJsonSchemaGrammar.js")));
    let initialPrompt = prompt ?? null;
    const model = new LlamaModel({
        modelPath: path_1.default.resolve(process_1.default.cwd(), modelArg),
        gpuLayers: gpuLayers != null ? gpuLayers : undefined
    });
    const context = new LlamaContext({
        model,
        contextSize,
        threads
    });
    const grammar = jsonSchemaGrammarFilePath != null
        ? new LlamaJsonSchemaGrammar(await fs_extra_1.default.readJson(path_1.default.resolve(process_1.default.cwd(), jsonSchemaGrammarFilePath)))
        : grammarArg !== "text"
            ? await LlamaGrammar.getFor(grammarArg)
            : undefined;
    const bos = context.getBosString(); // bos = beginning of sequence
    const eos = context.getEosString(); // eos = end of sequence
    const promptWrapper = getChatWrapper(wrapper, bos);
    const session = new LlamaChatSession({
        context,
        printLLamaSystemInfo: systemInfo,
        systemPrompt,
        promptWrapper
    });
    if (grammarArg != "text" && jsonSchemaGrammarFilePath != null)
        console.warn(chalk_1.default.yellow("Both `grammar` and `jsonSchemaGrammarFile` were specified. `jsonSchemaGrammarFile` will be used."));
    console.info(`${chalk_1.default.yellow("BOS:")} ${bos}`);
    console.info(`${chalk_1.default.yellow("EOS:")} ${eos}`);
    console.info(`${chalk_1.default.yellow("Chat wrapper:")} ${promptWrapper.wrapperName}`);
    console.info(`${chalk_1.default.yellow("Repeat penalty:")} ${repeatPenalty} (apply to last ${lastTokensRepeatPenalty} tokens)`);
    if (repeatFrequencyPenalty != null)
        console.info(`${chalk_1.default.yellow("Repeat frequency penalty:")} ${repeatFrequencyPenalty}`);
    if (repeatPresencePenalty != null)
        console.info(`${chalk_1.default.yellow("Repeat presence penalty:")} ${repeatPresencePenalty}`);
    if (!penalizeRepeatingNewLine)
        console.info(`${chalk_1.default.yellow("Penalize repeating new line:")} disabled`);
    if (jsonSchemaGrammarFilePath != null)
        console.info(`${chalk_1.default.yellow("JSON schema grammar file:")} ${path_1.default.relative(process_1.default.cwd(), path_1.default.resolve(process_1.default.cwd(), jsonSchemaGrammarFilePath))}`);
    else if (grammarArg !== "text")
        console.info(`${chalk_1.default.yellow("Grammar:")} ${grammarArg}`);
    await (0, withOra_js_1.default)({
        loading: chalk_1.default.blue("Loading model"),
        success: chalk_1.default.blue("Model loaded"),
        fail: chalk_1.default.blue("Failed to load model")
    }, async () => {
        await session.init();
    });
    // this is for ora to not interfere with readline
    await new Promise(resolve => setTimeout(resolve, 1));
    const replHistory = await ReplHistory_js_1.ReplHistory.load(config_js_1.chatCommandHistoryFilePath, !noHistory);
    async function getPrompt() {
        const rl = readline.createInterface({
            input: process_1.default.stdin,
            output: process_1.default.stdout,
            history: replHistory.history.slice()
        });
        const res = await new Promise((accept) => rl.question(chalk_1.default.yellow("> "), accept));
        rl.close();
        return res;
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const input = initialPrompt != null
            ? initialPrompt
            : await getPrompt();
        if (initialPrompt != null) {
            console.log(chalk_1.default.green("> ") + initialPrompt);
            initialPrompt = null;
        }
        else
            await replHistory.add(input);
        if (input === ".exit")
            break;
        process_1.default.stdout.write(chalk_1.default.yellow("AI: "));
        const [startColor, endColor] = chalk_1.default.blue("MIDDLE").split("MIDDLE");
        process_1.default.stdout.write(startColor);
        await session.prompt(input, {
            grammar,
            temperature,
            topK,
            topP,
            repeatPenalty: {
                penalty: repeatPenalty,
                frequencyPenalty: repeatFrequencyPenalty != null ? repeatFrequencyPenalty : undefined,
                presencePenalty: repeatPresencePenalty != null ? repeatPresencePenalty : undefined,
                penalizeNewLine: penalizeRepeatingNewLine,
                lastTokens: lastTokensRepeatPenalty
            },
            maxTokens: maxTokens === -1
                ? context.getContextSize()
                : maxTokens <= 0
                    ? undefined
                    : maxTokens,
            onToken(chunk) {
                process_1.default.stdout.write(session.context.decode(chunk));
            }
        });
        process_1.default.stdout.write(endColor);
        console.log();
        if (printTimings)
            context.printTimings();
    }
}
function getChatWrapper(wrapper, bos) {
    switch (wrapper) {
        case "general":
            return new GeneralChatPromptWrapper_js_1.GeneralChatPromptWrapper();
        case "llamaChat":
            return new LlamaChatPromptWrapper_js_1.LlamaChatPromptWrapper();
        case "chatML":
            return new ChatMLChatPromptWrapper_js_1.ChatMLChatPromptWrapper();
        case "falconChat":
            return new FalconChatPromptWrapper_js_1.FalconChatPromptWrapper();
        default:
    }
    if (wrapper === "auto") {
        const chatWrapper = (0, createChatWrapperByBos_js_1.getChatWrapperByBos)(bos);
        if (chatWrapper != null)
            return new chatWrapper();
        return new GeneralChatPromptWrapper_js_1.GeneralChatPromptWrapper();
    }
    void (wrapper);
    throw new Error("Unknown wrapper: " + wrapper);
}
