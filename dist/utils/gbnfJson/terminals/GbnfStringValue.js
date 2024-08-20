"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfStringValue = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
class GbnfStringValue extends GbnfTerminal_js_1.GbnfTerminal {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    getGrammar() {
        return [
            '"',
            '\\"',
            this.value
                .replaceAll("\\", "\\\\")
                .replaceAll("\t", "\\t")
                .replaceAll("\r", "\\r")
                .replaceAll("\n", "\\n")
                .replaceAll('"', "\\\\" + '\\"'),
            '\\"',
            '"'
        ].join("");
    }
}
exports.GbnfStringValue = GbnfStringValue;
