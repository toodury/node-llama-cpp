"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfOr = void 0;
const GbnfTerminal_js_1 = require("../GbnfTerminal.js");
const gbnfConsts_js_1 = require("./gbnfConsts.js");
class GbnfOr extends GbnfTerminal_js_1.GbnfTerminal {
    values;
    constructor(values) {
        super();
        this.values = values;
    }
    getGrammar(grammarGenerator) {
        const mappedValues = this.values
            .map(v => v.resolve(grammarGenerator))
            .filter(value => value !== "" && value !== gbnfConsts_js_1.grammarNoValue);
        if (mappedValues.length === 0)
            return gbnfConsts_js_1.grammarNoValue;
        else if (mappedValues.length === 1)
            return mappedValues[0];
        return "( " + mappedValues.join(" | ") + " )";
    }
    resolve(grammarGenerator) {
        const mappedValues = this.values
            .map(v => v.resolve(grammarGenerator))
            .filter(value => value !== "" && value !== gbnfConsts_js_1.grammarNoValue);
        if (mappedValues.length === 0)
            return gbnfConsts_js_1.grammarNoValue;
        else if (mappedValues.length === 1)
            return mappedValues[0];
        return super.resolve(grammarGenerator);
    }
}
exports.GbnfOr = GbnfOr;
