"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbortError = void 0;
class AbortError extends Error {
    /** @internal */
    constructor() {
        super("AbortError");
    }
}
exports.AbortError = AbortError;
