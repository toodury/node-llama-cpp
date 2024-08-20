"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfArray = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
const GbnfWhitespace_js_1 = require("./GbnfWhitespace.js");
const GbnfGrammar_js_1 = require("./GbnfGrammar.js");
const GbnfOr_js_1 = require("./GbnfOr.js");
class GbnfArray extends GbnfTerminal_js_1.GbnfTerminal {
    items;
    constructor(items) {
        super();
        this.items = items;
    }
    getGrammar(grammarGenerator) {
        const whitespaceRuleName = new GbnfWhitespace_js_1.GbnfWhitespace().resolve(grammarGenerator);
        const itemsGrammarRuleName = this.items.resolve(grammarGenerator);
        return new GbnfGrammar_js_1.GbnfGrammar([
            '"["', whitespaceRuleName,
            new GbnfOr_js_1.GbnfOr([
                new GbnfGrammar_js_1.GbnfGrammar([
                    "(", itemsGrammarRuleName, ")",
                    "(", '","', whitespaceRuleName, itemsGrammarRuleName, ")*"
                ]),
                new GbnfGrammar_js_1.GbnfGrammar([
                    "(", itemsGrammarRuleName, ")?"
                ])
            ]).getGrammar(grammarGenerator),
            whitespaceRuleName, '"]"'
        ]).getGrammar();
    }
}
exports.GbnfArray = GbnfArray;
