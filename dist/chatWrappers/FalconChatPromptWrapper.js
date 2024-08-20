"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FalconChatPromptWrapper = void 0;
const ChatPromptWrapper_js_1 = require("../ChatPromptWrapper.js");
const getTextCompletion_js_1 = require("../utils/getTextCompletion.js");
class FalconChatPromptWrapper extends ChatPromptWrapper_js_1.ChatPromptWrapper {
    wrapperName = "Falcon";
    _instructionName;
    _responseName;
    constructor({ instructionName = "User", responseName = "Assistant" } = {}) {
        super();
        this._instructionName = instructionName;
        this._responseName = responseName;
    }
    wrapPrompt(prompt, { systemPrompt, promptIndex, lastStopString, lastStopStringSuffix }) {
        if (promptIndex === 0)
            return systemPrompt + `\n${this._instructionName}: ` + prompt + `\n${this._responseName}: `;
        return this._getPromptPrefix(lastStopString, lastStopStringSuffix) + prompt + `\n${this._responseName}: `;
    }
    getStopStrings() {
        return [
            `\n${this._instructionName}: `,
            `\n${this._responseName}:`
        ];
    }
    getDefaultStopString() {
        return `\n${this._instructionName}: `;
    }
    _getPromptPrefix(lastStopString, lastStopStringSuffix) {
        return (0, getTextCompletion_js_1.getTextCompletion)((lastStopString ?? "") + (lastStopStringSuffix ?? ""), [
            `\n${this._instructionName}: `,
            `${this._instructionName}: `
        ]) ?? `\n${this._instructionName}: `;
    }
}
exports.FalconChatPromptWrapper = FalconChatPromptWrapper;
