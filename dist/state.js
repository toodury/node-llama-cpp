"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIsInDocumentationMode = exports.getIsInDocumentationMode = void 0;
let isInDocumentationMode = false;
function getIsInDocumentationMode() {
    return isInDocumentationMode;
}
exports.getIsInDocumentationMode = getIsInDocumentationMode;
function setIsInDocumentationMode(value) {
    isInDocumentationMode = value;
}
exports.setIsInDocumentationMode = setIsInDocumentationMode;
