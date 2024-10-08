"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlamaContext = void 0;
const removeNullFields_js_1 = require("../utils/removeNullFields.js");
const LlamaBins_js_1 = require("./LlamaBins.js");
class LlamaContext {
    _model;
    _ctx;
    _prependBos;
    _prependTokens;
    /** @internal */
    _chatGrammar;
    /**
     * @param {LlamaContextOptions} options
     */
    constructor({ model, prependBos = true, grammar, seed = model._contextOptions.seed, contextSize = model._contextOptions.contextSize, batchSize = model._contextOptions.batchSize, logitsAll = model._contextOptions.logitsAll, embedding = model._contextOptions.embedding, threads = model._contextOptions.threads }) {
        this._model = model;
        this._ctx = new LlamaBins_js_1.LLAMAContext(model._model, (0, removeNullFields_js_1.removeNullFields)({
            seed: seed != null ? Math.max(-1, seed) : undefined,
            contextSize,
            batchSize,
            logitsAll,
            embedding,
            threads
        }));
        this._prependBos = prependBos;
        this._prependTokens = [];
        this._chatGrammar = grammar;
        if (prependBos) {
            this._prependTokens.unshift(this._ctx.tokenBos());
        }
    }
    encode(text) {
        if (text === "")
            return new Uint32Array();
        return this._ctx.encode(text);
    }
    decode(tokens) {
        if (tokens.length === 0)
            return "";
        if (tokens instanceof Uint32Array)
            return this._ctx.decode(tokens);
        return this._ctx.decode(Uint32Array.from(tokens));
    }
    get prependBos() {
        return this._prependBos;
    }
    /**
     * @returns {Token | null} The BOS (Beginning Of Sequence) token.
     */
    getBosToken() {
        const bosToken = this._ctx.tokenBos();
        if (bosToken === -1)
            return null;
        return bosToken;
    }
    /**
     * @returns {Token | null} The EOS (End Of Sequence) token.
     */
    getEosToken() {
        const eosToken = this._ctx.tokenEos();
        if (eosToken === -1)
            return null;
        return eosToken;
    }
    /**
     * @returns {Token | null} The NL (New Line) token.
     */
    getNlToken() {
        const nlToken = this._ctx.tokenNl();
        if (nlToken === -1)
            return null;
        return nlToken;
    }
    /**
     * @returns {string | null} The BOS (Beginning Of Sequence) token as a string.
     */
    getBosString() {
        const bosToken = this.getBosToken();
        if (bosToken == null)
            return null;
        return this._ctx.getTokenString(bosToken);
    }
    /**
     * @returns {string | null} The EOS (End Of Sequence) token as a string.
     */
    getEosString() {
        const eosToken = this.getEosToken();
        if (eosToken == null)
            return null;
        return this._ctx.getTokenString(eosToken);
    }
    /**
     * @returns {string | null} The NL (New Line) token as a string.
     */
    getNlString() {
        const nlToken = this.getNlToken();
        if (nlToken == null)
            return null;
        return this._ctx.getTokenString(nlToken);
    }
    getContextSize() {
        return this._ctx.getContextSize();
    }
    printTimings() {
        this._ctx.printTimings();
    }
    /**
     * @param {Uint32Array} tokens
     * @param {object} options
     * @returns {AsyncGenerator<Token, void>}
     */
    async *evaluate(tokens, { temperature = this._model._evaluationOptions.temperature, topK = this._model._evaluationOptions.topK, topP = this._model._evaluationOptions.topP, grammarEvaluationState, repeatPenalty } = {}) {
        let evalTokens = tokens;
        if (this._prependTokens.length > 0) {
            const tokenArray = this._prependTokens.concat(Array.from(tokens));
            evalTokens = Uint32Array.from(tokenArray);
            this._prependTokens = [];
        }
        if (evalTokens.length === 0)
            return;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // Evaluate to get the next token.
            const nextToken = await this._ctx.eval(evalTokens, (0, removeNullFields_js_1.removeNullFields)({
                temperature,
                topK,
                topP,
                repeatPenalty: repeatPenalty?.penalty,
                repeatPenaltyTokens: repeatPenalty?.punishTokens instanceof Function
                    ? repeatPenalty.punishTokens()
                    : repeatPenalty?.punishTokens,
                repeatPenaltyPresencePenalty: repeatPenalty?.presencePenalty,
                repeatPenaltyFrequencyPenalty: repeatPenalty?.frequencyPenalty,
                grammarEvaluationState: grammarEvaluationState?._state
            }));
            // the assistant finished answering
            if (nextToken === this._ctx.tokenEos())
                break;
            yield nextToken;
            // Create tokens for the next eval.
            evalTokens = Uint32Array.from([nextToken]);
        }
    }
}
exports.LlamaContext = LlamaContext;
