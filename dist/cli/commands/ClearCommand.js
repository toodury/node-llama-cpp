"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearLlamaCppBuildCommand = exports.ClearCommand = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const config_js_1 = require("../../config.js");
const withOra_js_1 = __importDefault(require("../../utils/withOra.js"));
const clearLlamaBuild_js_1 = require("../../utils/clearLlamaBuild.js");
const usedBinFlag_js_1 = require("../../utils/usedBinFlag.js");
const cmake_js_1 = require("../../utils/cmake.js");
exports.ClearCommand = {
    command: "clear [type]",
    aliases: ["clean"],
    describe: "Clear files created by node-llama-cpp",
    builder(yargs) {
        return yargs
            .option("type", {
            type: "string",
            choices: ["source", "build", "cmake", "all"],
            default: "all",
            description: "Files to clear"
        });
    },
    handler: ClearLlamaCppBuildCommand
};
async function ClearLlamaCppBuildCommand({ type }) {
    if (type === "source" || type === "all") {
        await (0, withOra_js_1.default)({
            loading: chalk_1.default.blue("Clearing source"),
            success: chalk_1.default.blue("Cleared source"),
            fail: chalk_1.default.blue("Failed to clear source")
        }, async () => {
            await fs_extra_1.default.remove(config_js_1.llamaCppDirectory);
            await fs_extra_1.default.remove(config_js_1.llamaCppDirectoryTagFilePath);
        });
    }
    if (type === "build" || type === "all") {
        await (0, withOra_js_1.default)({
            loading: chalk_1.default.blue("Clearing build"),
            success: chalk_1.default.blue("Cleared build"),
            fail: chalk_1.default.blue("Failed to clear build")
        }, async () => {
            await (0, clearLlamaBuild_js_1.clearLlamaBuild)();
        });
    }
    if (type === "cmake" || type === "all") {
        await (0, withOra_js_1.default)({
            loading: chalk_1.default.blue("Clearing internal cmake"),
            success: chalk_1.default.blue("Cleared internal cmake"),
            fail: chalk_1.default.blue("Failed to clear internal cmake")
        }, async () => {
            await (0, cmake_js_1.fixXpackPermissions)();
            await (0, cmake_js_1.clearLocalCmake)();
        });
    }
    await (0, usedBinFlag_js_1.setUsedBinFlag)("prebuiltBinaries");
}
exports.ClearLlamaCppBuildCommand = ClearLlamaCppBuildCommand;
