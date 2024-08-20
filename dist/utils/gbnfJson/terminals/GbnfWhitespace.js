"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfWhitespace = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
const gbnfConsts_js_1 = require("./gbnfConsts.js");
class GbnfWhitespace extends GbnfTerminal_js_1.GbnfTerminal {
    newLinesAllowed;
    constructor({ newLinesAllowed = true } = {}) {
        super();
        this.newLinesAllowed = newLinesAllowed;
    }
    getGrammar() {
        if (this.newLinesAllowed)
            return "[\\n]? [ \\t]* [\\n]?";
        return "[ \\t]*";
    }
    getRuleName() {
        if (this.newLinesAllowed)
            return gbnfConsts_js_1.reservedRuleNames.whitespace.withNewLines;
        return gbnfConsts_js_1.reservedRuleNames.whitespace.withoutNewLines;
    }
}
exports.GbnfWhitespace = GbnfWhitespace;
