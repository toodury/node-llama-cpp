"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyChatPromptWrapper = void 0;
const ChatPromptWrapper_js_1 = require("../ChatPromptWrapper.js");
class EmptyChatPromptWrapper extends ChatPromptWrapper_js_1.ChatPromptWrapper {
    wrapperName = "Empty";
}
exports.EmptyChatPromptWrapper = EmptyChatPromptWrapper;
