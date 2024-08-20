"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfNumberValue = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
class GbnfNumberValue extends GbnfTerminal_js_1.GbnfTerminal {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    getGrammar() {
        return '"' + JSON.stringify(this.value) + '"';
    }
    resolve() {
        return this.getGrammar();
    }
}
exports.GbnfNumberValue = GbnfNumberValue;
