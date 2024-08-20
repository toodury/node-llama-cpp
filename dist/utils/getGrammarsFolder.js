"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrammarsFolder = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_js_1 = require("../config.js");
const usedBinFlag_js_1 = require("./usedBinFlag.js");
async function getGrammarsFolder() {
    const usedBinFlag = await (0, usedBinFlag_js_1.getUsedBinFlag)();
    if (usedBinFlag === "localBuildFromSource") {
        if (await fs_extra_1.default.pathExists(config_js_1.llamaCppGrammarsDirectory))
            return config_js_1.llamaCppGrammarsDirectory;
    }
    else if (usedBinFlag === "prebuiltBinaries") {
        if (await fs_extra_1.default.pathExists(config_js_1.llamaBinsGrammarsDirectory))
            return config_js_1.llamaBinsGrammarsDirectory;
        else if (await fs_extra_1.default.pathExists(config_js_1.llamaCppGrammarsDirectory))
            return config_js_1.llamaCppGrammarsDirectory;
    }
    throw new Error("Grammars folder not found");
}
exports.getGrammarsFolder = getGrammarsFolder;
