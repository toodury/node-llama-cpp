"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNullFields = void 0;
function removeNullFields(obj) {
    const newObj = Object.assign({}, obj);
    for (const key in obj) {
        if (newObj[key] == null)
            delete newObj[key];
    }
    return newObj;
}
exports.removeNullFields = removeNullFields;
