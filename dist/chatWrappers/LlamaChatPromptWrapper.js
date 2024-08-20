"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlamaChatPromptWrapper = void 0;
const ChatPromptWrapper_js_1 = require("../ChatPromptWrapper.js");
const getTextCompletion_js_1 = require("../utils/getTextCompletion.js");
// source: https://huggingface.co/blog/llama2#how-to-prompt-llama-2
class LlamaChatPromptWrapper extends ChatPromptWrapper_js_1.ChatPromptWrapper {
    wrapperName = "LlamaChat";
    wrapPrompt(prompt, { systemPrompt, promptIndex, lastStopString, lastStopStringSuffix }) {
        const previousCompletionEnd = (lastStopString ?? "") + (lastStopStringSuffix ?? "");
        if (promptIndex === 0 && systemPrompt != "") {
            return ((0, getTextCompletion_js_1.getTextCompletion)(previousCompletionEnd, "<s>[INST] <<SYS>>\n") ?? "<s>[INST] <<SYS>>\n") + systemPrompt +
                "\n<</SYS>>\n\n" + prompt + " [/INST]\n\n";
        }
        else {
            return ((0, getTextCompletion_js_1.getTextCompletion)(previousCompletionEnd, "</s><s>[INST] ") ?? "<s>[INST] ") + prompt + " [/INST]\n\n";
        }
    }
    getStopStrings() {
        return ["</s>"];
    }
    getDefaultStopString() {
        return "</s>";
    }
}
exports.LlamaChatPromptWrapper = LlamaChatPromptWrapper;
