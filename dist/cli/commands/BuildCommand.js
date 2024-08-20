"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildLlamaCppCommand = exports.BuildCommand = void 0;
const process_1 = __importDefault(require("process"));
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const compileLLamaCpp_js_1 = require("../../utils/compileLLamaCpp.js");
const withOra_js_1 = __importDefault(require("../../utils/withOra.js"));
const clearTempFolder_js_1 = require("../../utils/clearTempFolder.js");
const config_js_1 = require("../../config.js");
const cmake_js_1 = require("../../utils/cmake.js");
const withStatusLogs_js_1 = __importDefault(require("../../utils/withStatusLogs.js"));
const state_js_1 = require("../../state.js");
exports.BuildCommand = {
    command: "build",
    describe: "Compile the currently downloaded llama.cpp",
    builder(yargs) {
        const isInDocumentationMode = (0, state_js_1.getIsInDocumentationMode)();
        return yargs
            .option("arch", {
            alias: "a",
            type: "string",
            description: "The architecture to compile llama.cpp for"
        })
            .option("nodeTarget", {
            alias: "t",
            type: "string",
            description: "The Node.js version to compile llama.cpp for. Example: v18.0.0"
        })
            .option("metal", {
            type: "boolean",
            default: config_js_1.defaultLlamaCppMetalSupport || isInDocumentationMode,
            description: "Compile llama.cpp with Metal support. Enabled by default on macOS. Can be disabled with \"--no-metal\". Can also be set via the NODE_LLAMA_CPP_METAL environment variable"
        })
            .option("cuda", {
            type: "boolean",
            default: config_js_1.defaultLlamaCppCudaSupport,
            description: "Compile llama.cpp with CUDA support. Can also be set via the NODE_LLAMA_CPP_CUDA environment variable"
        });
    },
    handler: BuildLlamaCppCommand
};
async function BuildLlamaCppCommand({ arch = undefined, nodeTarget = undefined, metal = config_js_1.defaultLlamaCppMetalSupport, cuda = config_js_1.defaultLlamaCppCudaSupport }) {
    if (!(await fs_extra_1.default.pathExists(config_js_1.llamaCppDirectory))) {
        console.log(chalk_1.default.red('llama.cpp is not downloaded. Please run "node-llama-cpp download" first'));
        process_1.default.exit(1);
    }
    if (metal && process_1.default.platform === "darwin") {
        console.log(`${chalk_1.default.yellow("Metal:")} enabled`);
    }
    if (cuda) {
        console.log(`${chalk_1.default.yellow("CUDA:")} enabled`);
    }
    await (0, cmake_js_1.downloadCmakeIfNeeded)(true);
    await (0, withStatusLogs_js_1.default)({
        loading: chalk_1.default.blue("Compiling llama.cpp"),
        success: chalk_1.default.blue("Compiled llama.cpp"),
        fail: chalk_1.default.blue("Failed to compile llama.cpp")
    }, async () => {
        await (0, compileLLamaCpp_js_1.compileLlamaCpp)({
            arch: arch ? arch : undefined,
            nodeTarget: nodeTarget ? nodeTarget : undefined,
            setUsedBinFlag: true,
            metal,
            cuda
        });
    });
    await (0, withOra_js_1.default)({
        loading: chalk_1.default.blue("Removing temporary files"),
        success: chalk_1.default.blue("Removed temporary files"),
        fail: chalk_1.default.blue("Failed to remove temporary files")
    }, async () => {
        await (0, clearTempFolder_js_1.clearTempFolder)();
    });
}
exports.BuildLlamaCppCommand = BuildLlamaCppCommand;
