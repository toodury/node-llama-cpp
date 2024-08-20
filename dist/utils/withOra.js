"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
async function withOra(message, callback) {
    const spinner = (0, ora_1.default)(typeof message === "string" ? message : message.loading);
    spinner.start();
    try {
        const res = await callback();
        if (typeof message !== "string")
            spinner.succeed(message.success);
        else
            spinner.succeed();
        return res;
    }
    catch (er) {
        if (typeof message !== "string")
            spinner.fail(message.fail);
        else
            spinner.fail();
        throw er;
    }
}
exports.default = withOra;
