"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const log_symbols_1 = __importDefault(require("log-symbols"));
const clockChar = "\u25f7";
async function withStatusLogs(message, callback) {
    console.log(`${chalk_1.default.cyan(clockChar)} ${typeof message === "string" ? message : message.loading}`);
    try {
        const res = await callback();
        if (typeof message !== "string")
            console.log(`${log_symbols_1.default.success} ${message.success}`);
        else
            console.log(`${log_symbols_1.default.success} ${message}`);
        return res;
    }
    catch (er) {
        if (typeof message !== "string")
            console.log(`${log_symbols_1.default.error} ${message.fail}`);
        else
            console.log(`${log_symbols_1.default.error} ${message}`);
        throw er;
    }
}
exports.default = withStatusLogs;
