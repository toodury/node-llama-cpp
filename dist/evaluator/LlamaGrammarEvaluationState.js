/**
 * Grammar evaluation state is used to track the model response to determine the next allowed characters for the model to generate.
 *
 * Create a new grammar evaluation state for every response you generate with the model.
 *
 * This is only needed when using the `LlamaContext` class directly, since `LlamaChatSession` already handles this for you.
 */
export class LlamaGrammarEvaluationState {
    /** @internal */ _llama;
    /** @internal */ _state;
    /**
     * @param options
     */
    constructor({ model, grammar }) {
        this._llama = model._llama;
        if (model._llama !== grammar._llama)
            throw new Error("The given LlamaModel and LlamaGrammar must be from the same Llama instance");
        this._state = new model._llama._bindings.AddonGrammarEvaluationState(model._model, grammar._grammar);
    }
}
//# sourceMappingURL=LlamaGrammarEvaluationState.js.map