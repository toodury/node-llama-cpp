"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatWrapperByBos = void 0;
const LlamaChatPromptWrapper_js_1 = require("./LlamaChatPromptWrapper.js");
const ChatMLChatPromptWrapper_js_1 = require("./ChatMLChatPromptWrapper.js");
function getChatWrapperByBos(bos) {
    if (bos === "" || bos == null)
        return null;
    if ("<s>[INST] <<SYS>>\n".startsWith(bos)) {
        return LlamaChatPromptWrapper_js_1.LlamaChatPromptWrapper;
    }
    else if ("<|im_start|>system\n".startsWith(bos)) {
        return ChatMLChatPromptWrapper_js_1.ChatMLChatPromptWrapper;
    }
    return null;
}
exports.getChatWrapperByBos = getChatWrapperByBos;
