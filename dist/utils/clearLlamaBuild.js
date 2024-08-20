"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLlamaBuild = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_js_1 = require("../config.js");
const clearTempFolder_js_1 = require("./clearTempFolder.js");
async function clearLlamaBuild() {
    await fs_extra_1.default.remove(path_1.default.join(config_js_1.llamaDirectory, "Debug"));
    await fs_extra_1.default.remove(path_1.default.join(config_js_1.llamaDirectory, "Release"));
    await fs_extra_1.default.remove(path_1.default.join(config_js_1.llamaDirectory, "compile_commands.json"));
    await fs_extra_1.default.remove(path_1.default.join(config_js_1.llamaDirectory, "build"));
    await (0, clearTempFolder_js_1.clearTempFolder)();
}
exports.clearLlamaBuild = clearLlamaBuild;
