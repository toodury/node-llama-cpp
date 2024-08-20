"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfNumber = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
const gbnfConsts_js_1 = require("./gbnfConsts.js");
class GbnfNumber extends GbnfTerminal_js_1.GbnfTerminal {
    allowFractional;
    constructor({ allowFractional = true }) {
        super();
        this.allowFractional = allowFractional;
    }
    getGrammar() {
        const numberGrammar = '("-"? ([0-9] | [1-9] [0-9]*))';
        if (this.allowFractional)
            return numberGrammar + ' ("." [0-9]+)? ([eE] [-+]? [0-9]+)?';
        return numberGrammar;
    }
    getRuleName() {
        if (this.allowFractional)
            return gbnfConsts_js_1.reservedRuleNames.number.fractional;
        return gbnfConsts_js_1.reservedRuleNames.number.integer;
    }
}
exports.GbnfNumber = GbnfNumber;
