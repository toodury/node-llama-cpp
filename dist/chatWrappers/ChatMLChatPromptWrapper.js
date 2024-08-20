"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMLChatPromptWrapper = void 0;
const ChatPromptWrapper_js_1 = require("../ChatPromptWrapper.js");
const getTextCompletion_js_1 = require("../utils/getTextCompletion.js");
// source: https://github.com/openai/openai-python/blob/120d225b91a8453e15240a49fb1c6794d8119326/chatml.md
class ChatMLChatPromptWrapper extends ChatPromptWrapper_js_1.ChatPromptWrapper {
    wrapperName = "ChatML";
    wrapPrompt(prompt, { systemPrompt, promptIndex, lastStopString, lastStopStringSuffix }) {
        const previousCompletionEnd = (lastStopString ?? "") + (lastStopStringSuffix ?? "");
        if (promptIndex === 0 && systemPrompt != "")
            return ((0, getTextCompletion_js_1.getTextCompletion)(previousCompletionEnd, "<|im_start|>system\n") ?? "<|im_start|>system\n") +
                systemPrompt + "<|im_end|>\n<|im_start|>user\n" + prompt + "<|im_end|>\n<|im_start|>assistant\n";
        else
            return ((0, getTextCompletion_js_1.getTextCompletion)(previousCompletionEnd, "<|im_end|>\n<|im_start|>user\n") ?? "<|im_end|>\n<|im_start|>user\n") +
                prompt + "<|im_end|>\n<|im_start|>assistant\n";
    }
    getStopStrings() {
        return ["<|im_end|>"];
    }
    getDefaultStopString() {
        return "<|im_end|>";
    }
}
exports.ChatMLChatPromptWrapper = ChatMLChatPromptWrapper;
