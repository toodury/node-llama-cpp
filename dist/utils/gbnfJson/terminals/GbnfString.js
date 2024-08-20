"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfString = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
const gbnfConsts_js_1 = require("./gbnfConsts.js");
class GbnfString extends GbnfTerminal_js_1.GbnfTerminal {
    getGrammar() {
        return '"\\"" ( ' +
            '[^"\\\\]' +
            " | " +
            '"\\\\" (["\\\\/bfnrt] | "u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F])' + // escape sequences
            ')* "\\""';
    }
    getRuleName() {
        return gbnfConsts_js_1.reservedRuleNames.string;
    }
}
exports.GbnfString = GbnfString;
