"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTempFolder = void 0;
const process_1 = __importDefault(require("process"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_js_1 = require("../config.js");
async function clearTempFolder() {
    if (process_1.default.platform === "win32") {
        try {
            await fs_extra_1.default.remove(config_js_1.tempDownloadDirectory);
        }
        catch (err) {
            // do nothing as it fails sometime on Windows, and since it's a temp folder, it's not a big deal
        }
        return;
    }
    await fs_extra_1.default.remove(config_js_1.tempDownloadDirectory);
}
exports.clearTempFolder = clearTempFolder;
