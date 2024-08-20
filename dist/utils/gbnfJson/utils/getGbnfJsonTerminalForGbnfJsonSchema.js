"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGbnfJsonTerminalForGbnfJsonSchema = void 0;
const GbnfOr_js_1 = require("../terminals/GbnfOr.js");
const GbnfObjectMap_js_1 = require("../terminals/GbnfObjectMap.js");
const GbnfStringValue_js_1 = require("../terminals/GbnfStringValue.js");
const GbnfArray_js_1 = require("../terminals/GbnfArray.js");
const GbnfString_js_1 = require("../terminals/GbnfString.js");
const GbnfNumber_js_1 = require("../terminals/GbnfNumber.js");
const GbnfBoolean_js_1 = require("../terminals/GbnfBoolean.js");
const GbnfNull_js_1 = require("../terminals/GbnfNull.js");
const types_js_1 = require("../types.js");
const getGbnfJsonTerminalForLiteral_js_1 = require("./getGbnfJsonTerminalForLiteral.js");
function getGbnfJsonTerminalForGbnfJsonSchema(schema, grammarGenerator) {
    if ((0, types_js_1.isGbnfJsonOneOfSchema)(schema)) {
        const values = schema.oneOf
            .map((altSchema) => getGbnfJsonTerminalForGbnfJsonSchema(altSchema, grammarGenerator));
        return new GbnfOr_js_1.GbnfOr(values);
    }
    else if ((0, types_js_1.isGbnfJsonConstSchema)(schema)) {
        return (0, getGbnfJsonTerminalForLiteral_js_1.getGbnfJsonTerminalForLiteral)(schema.const);
    }
    else if ((0, types_js_1.isGbnfJsonEnumSchema)(schema)) {
        return new GbnfOr_js_1.GbnfOr(schema.enum.map((item) => (0, getGbnfJsonTerminalForLiteral_js_1.getGbnfJsonTerminalForLiteral)(item)));
    }
    else if ((0, types_js_1.isGbnfJsonObjectSchema)(schema)) {
        return new GbnfObjectMap_js_1.GbnfObjectMap(Object.entries(schema.properties).map(([propName, propSchema]) => {
            return {
                required: true,
                key: new GbnfStringValue_js_1.GbnfStringValue(propName),
                value: getGbnfJsonTerminalForGbnfJsonSchema(propSchema, grammarGenerator)
            };
        }));
    }
    else if ((0, types_js_1.isGbnfJsonArraySchema)(schema)) {
        return new GbnfArray_js_1.GbnfArray(getGbnfJsonTerminalForGbnfJsonSchema(schema.items, grammarGenerator));
    }
    const terminals = [];
    if ((0, types_js_1.isGbnfJsonBasicSchemaIncludesType)(schema, "string"))
        terminals.push(new GbnfString_js_1.GbnfString());
    if ((0, types_js_1.isGbnfJsonBasicSchemaIncludesType)(schema, "number"))
        terminals.push(new GbnfNumber_js_1.GbnfNumber({ allowFractional: true }));
    if ((0, types_js_1.isGbnfJsonBasicSchemaIncludesType)(schema, "integer"))
        terminals.push(new GbnfNumber_js_1.GbnfNumber({ allowFractional: false }));
    if ((0, types_js_1.isGbnfJsonBasicSchemaIncludesType)(schema, "boolean"))
        terminals.push(new GbnfBoolean_js_1.GbnfBoolean());
    if ((0, types_js_1.isGbnfJsonBasicSchemaIncludesType)(schema, "null"))
        terminals.push(new GbnfNull_js_1.GbnfNull());
    return new GbnfOr_js_1.GbnfOr(terminals);
}
exports.getGbnfJsonTerminalForGbnfJsonSchema = getGbnfJsonTerminalForGbnfJsonSchema;
