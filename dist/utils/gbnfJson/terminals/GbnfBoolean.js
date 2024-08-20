"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfBoolean = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
const GbnfOr_js_1 = require("./GbnfOr.js");
const GbnfGrammar_js_1 = require("./GbnfGrammar.js");
const gbnfConsts_js_1 = require("./gbnfConsts.js");
class GbnfBoolean extends GbnfTerminal_js_1.GbnfTerminal {
    getGrammar(grammarGenerator) {
        return new GbnfOr_js_1.GbnfOr([
            new GbnfGrammar_js_1.GbnfGrammar('"true"'),
            new GbnfGrammar_js_1.GbnfGrammar('"false"')
        ]).getGrammar(grammarGenerator);
    }
    getRuleName() {
        return gbnfConsts_js_1.reservedRuleNames.boolean;
    }
}
exports.GbnfBoolean = GbnfBoolean;
