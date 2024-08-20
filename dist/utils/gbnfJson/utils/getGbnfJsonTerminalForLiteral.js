"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGbnfJsonTerminalForLiteral = void 0;
const GbnfNull_js_1 = require("../terminals/GbnfNull.js");
const GbnfBooleanValue_js_1 = require("../terminals/GbnfBooleanValue.js");
const GbnfNumberValue_js_1 = require("../terminals/GbnfNumberValue.js");
const GbnfStringValue_js_1 = require("../terminals/GbnfStringValue.js");
function getGbnfJsonTerminalForLiteral(literal) {
    if (literal === null)
        return new GbnfNull_js_1.GbnfNull();
    if (typeof literal === "boolean")
        return new GbnfBooleanValue_js_1.GbnfBooleanValue(literal);
    if (typeof literal === "number")
        return new GbnfNumberValue_js_1.GbnfNumberValue(literal);
    if (typeof literal === "string")
        return new GbnfStringValue_js_1.GbnfStringValue(literal);
    throw new Error(`Unrecognized literal type: ${typeof literal}`);
}
exports.getGbnfJsonTerminalForLiteral = getGbnfJsonTerminalForLiteral;
