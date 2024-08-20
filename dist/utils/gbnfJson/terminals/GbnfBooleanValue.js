"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfBooleanValue = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
class GbnfBooleanValue extends GbnfTerminal_js_1.GbnfTerminal {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    getGrammar() {
        if (this.value)
            return '"true"';
        return '"false"';
    }
    resolve() {
        return this.getGrammar();
    }
}
exports.GbnfBooleanValue = GbnfBooleanValue;
