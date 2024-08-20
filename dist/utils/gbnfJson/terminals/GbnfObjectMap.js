"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfObjectMap = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
const GbnfWhitespace_js_1 = require("./GbnfWhitespace.js");
const GbnfGrammar_js_1 = require("./GbnfGrammar.js");
class GbnfObjectMap extends GbnfTerminal_js_1.GbnfTerminal {
    fields;
    constructor(fields) {
        super();
        this.fields = fields;
    }
    getGrammar(grammarGenerator) {
        const whitespaceRuleName = new GbnfWhitespace_js_1.GbnfWhitespace().resolve(grammarGenerator);
        return new GbnfGrammar_js_1.GbnfGrammar([
            '"{"', whitespaceRuleName,
            ...this.fields.map(({ key, value }, index) => {
                return new GbnfGrammar_js_1.GbnfGrammar([
                    key.getGrammar(), '":"', "[ ]?", value.resolve(grammarGenerator),
                    index < this.fields.length - 1 ? '","' : "",
                    whitespaceRuleName
                ]).getGrammar();
            }),
            '"}"'
        ]).getGrammar();
    }
}
exports.GbnfObjectMap = GbnfObjectMap;
