"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfNull = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
const gbnfConsts_js_1 = require("./gbnfConsts.js");
class GbnfNull extends GbnfTerminal_js_1.GbnfTerminal {
    getGrammar() {
        return '"null"';
    }
    getRuleName() {
        return gbnfConsts_js_1.reservedRuleNames.null;
    }
}
exports.GbnfNull = GbnfNull;
