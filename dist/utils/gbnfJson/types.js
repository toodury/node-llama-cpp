"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGbnfJsonBasicSchemaIncludesType = exports.isGbnfJsonArraySchema = exports.isGbnfJsonObjectSchema = exports.isGbnfJsonOneOfSchema = exports.isGbnfJsonEnumSchema = exports.isGbnfJsonConstSchema = void 0;
function isGbnfJsonConstSchema(schema) {
    return schema.const !== undefined;
}
exports.isGbnfJsonConstSchema = isGbnfJsonConstSchema;
function isGbnfJsonEnumSchema(schema) {
    return schema.enum != null;
}
exports.isGbnfJsonEnumSchema = isGbnfJsonEnumSchema;
function isGbnfJsonOneOfSchema(schema) {
    return schema.oneOf != null;
}
exports.isGbnfJsonOneOfSchema = isGbnfJsonOneOfSchema;
function isGbnfJsonObjectSchema(schema) {
    return schema.type === "object";
}
exports.isGbnfJsonObjectSchema = isGbnfJsonObjectSchema;
function isGbnfJsonArraySchema(schema) {
    return schema.type === "array";
}
exports.isGbnfJsonArraySchema = isGbnfJsonArraySchema;
function isGbnfJsonBasicSchemaIncludesType(schema, type) {
    if (schema.type instanceof Array)
        return schema.type.includes(type);
    return schema.type === type;
}
exports.isGbnfJsonBasicSchemaIncludesType = isGbnfJsonBasicSchemaIncludesType;
