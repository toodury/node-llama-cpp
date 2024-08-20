"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservedRuleNames = exports.grammarNoValue = void 0;
exports.grammarNoValue = '""';
exports.reservedRuleNames = {
    null: "null-rule",
    boolean: "boolean-rule",
    number: {
        fractional: "fractional-number-rule",
        integer: "integer-number-rule"
    },
    string: "string-rule",
    whitespace: {
        withNewLines: "whitespace-new-lines-rule",
        withoutNewLines: "whitespace-no-new-lines-rule"
    }
};
