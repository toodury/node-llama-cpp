"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfGrammar = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
class GbnfGrammar extends GbnfTerminal_js_1.GbnfTerminal {
    grammar;
    constructor(grammar) {
        super();
        this.grammar = grammar;
    }
    getGrammar() {
        if (this.grammar instanceof Array)
            return this.grammar
                .filter((item) => item !== "")
                .join(" ");
        return this.grammar;
    }
}
exports.GbnfGrammar = GbnfGrammar;
