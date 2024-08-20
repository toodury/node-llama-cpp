"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlamaGrammarEvaluationState = void 0;
const LlamaBins_js_1 = require("./LlamaBins.js");
class LlamaGrammarEvaluationState {
    /** @internal */
    _state;
    /**
     * Grammar evaluation state is used to track the model response to determine the next allowed characters for the model to generate.
     * Create a new grammar evaluation state for every response you generate with the model.
     * This is only needed when using the `LlamaContext` class directly, as `LlamaChatSession` already handles this for you.
     * @param {object} options
     * @param {LlamaGrammar} options.grammar
     */
    constructor({ grammar }) {
        this._state = new LlamaBins_js_1.LLAMAGrammarEvaluationState(grammar._grammar);
    }
}
exports.LlamaGrammarEvaluationState = LlamaGrammarEvaluationState;
