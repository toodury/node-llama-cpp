"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlamaJsonSchemaGrammar = void 0;
const getGbnfGrammarForGbnfJsonSchema_js_1 = require("../utils/getGbnfGrammarForGbnfJsonSchema.js");
const validateObjectAgainstGbnfSchema_js_1 = require("../utils/gbnfJson/utils/validateObjectAgainstGbnfSchema.js");
const LlamaGrammar_js_1 = require("./LlamaGrammar.js");
class LlamaJsonSchemaGrammar extends LlamaGrammar_js_1.LlamaGrammar {
    _schema;
    constructor(schema) {
        const grammar = (0, getGbnfGrammarForGbnfJsonSchema_js_1.getGbnfGrammarForGbnfJsonSchema)(schema);
        super({
            grammar,
            stopStrings: ["\n".repeat(4)],
            trimWhitespaceSuffix: true
        });
        this._schema = schema;
    }
    parse(json) {
        const parsedJson = JSON.parse(json);
        (0, validateObjectAgainstGbnfSchema_js_1.validateObjectAgainstGbnfSchema)(parsedJson, this._schema);
        return parsedJson;
    }
}
exports.LlamaJsonSchemaGrammar = LlamaJsonSchemaGrammar;
