"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatPromptWrapper = void 0;
class ChatPromptWrapper {
    wrapPrompt(prompt, { systemPrompt, promptIndex }) {
        if (promptIndex === 0) {
            return systemPrompt + "\n" + prompt;
        }
        else {
            return prompt;
        }
    }
    getStopStrings() {
        return [];
    }
    getDefaultStopString() {
        const stopString = this.getStopStrings()[0];
        if (stopString == null || stopString.length === 0)
            throw new Error(`Prompt wrapper "${this.wrapperName}" has no stop strings`);
        return stopString;
    }
}
exports.ChatPromptWrapper = ChatPromptWrapper;
