"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUsedBinFlag = exports.getUsedBinFlag = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_js_1 = require("../config.js");
async function getUsedBinFlag() {
    const usedBinFlagJson = await fs_extra_1.default.readJson(config_js_1.usedBinFlagJsonPath);
    return usedBinFlagJson.use;
}
exports.getUsedBinFlag = getUsedBinFlag;
async function setUsedBinFlag(useFlag) {
    const usedBinFlagJson = {
        use: useFlag
    };
    await fs_extra_1.default.writeJson(config_js_1.usedBinFlagJsonPath, usedBinFlagJson, {
        spaces: 4
    });
}
exports.setUsedBinFlag = setUsedBinFlag;
