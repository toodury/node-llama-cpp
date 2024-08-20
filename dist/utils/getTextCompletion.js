"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextCompletion = void 0;
function getTextCompletion(text, fullText) {
    if (text == null) {
        return null;
    }
    const fullTexts = typeof fullText === "string" ? [fullText] : fullText;
    for (const fullText of fullTexts) {
        if (fullText.startsWith(text))
            return fullText.slice(text.length);
    }
    return null;
}
exports.getTextCompletion = getTextCompletion;
