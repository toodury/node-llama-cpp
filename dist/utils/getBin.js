"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBin = exports.getPrebuildBinPath = void 0;
const module_1 = require("module");
const console = __importStar(require("console"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_js_1 = require("../config.js");
const DownloadCommand_js_1 = require("../cli/commands/DownloadCommand.js");
const usedBinFlag_js_1 = require("./usedBinFlag.js");
const compileLLamaCpp_js_1 = require("./compileLLamaCpp.js");
const nodeRequire = (0, module_1.createRequire)(__dirname);
async function getPrebuildBinPath() {
    function createPath(platform, arch) {
        return path_1.default.join(config_js_1.llamaBinsDirectory, `${platform}-${arch}/llama-addon.node`);
    }
    async function resolvePath(platform, arch) {
        const binPath = createPath(platform, arch);
        if (await fs_extra_1.default.pathExists(binPath))
            return binPath;
        return null;
    }
    async function getPath() {
        switch (process_1.default.platform) {
            case "win32":
            case "cygwin":
                return resolvePath("win", process_1.default.arch);
            case "linux":
            case "android":
                return resolvePath("linux", process_1.default.arch);
            case "darwin":
                return resolvePath("mac", process_1.default.arch);
        }
        return null;
    }
    return await getPath();
}
exports.getPrebuildBinPath = getPrebuildBinPath;
async function loadBin() {
    const usedBinFlag = await (0, usedBinFlag_js_1.getUsedBinFlag)();
    if (usedBinFlag === "prebuiltBinaries") {
        const prebuildBinPath = await getPrebuildBinPath();
        if (prebuildBinPath == null) {
            console.warn("Prebuild binaries not found, falling back to to locally built binaries");
        }
        else {
            try {
                return nodeRequire(prebuildBinPath);
            }
            catch (err) {
                console.error(`Failed to load prebuilt binary for platform "${process_1.default.platform}" "${process_1.default.arch}". Error:`, err);
                console.info("Falling back to locally built binaries");
                try {
                    delete nodeRequire.cache[nodeRequire.resolve(prebuildBinPath)];
                }
                catch (err) { }
            }
        }
    }
    const modulePath = await (0, compileLLamaCpp_js_1.getCompiledLlamaCppBinaryPath)();
    if (modulePath == null) {
        if (config_js_1.defaultSkipDownload) {
            throw new Error("No prebuild binaries found and NODE_LLAMA_CPP_SKIP_DOWNLOAD env var is set to true");
        }
        else {
            await (0, DownloadCommand_js_1.DownloadLlamaCppCommand)({
                repo: config_js_1.defaultLlamaCppGitHubRepo,
                release: config_js_1.defaultLlamaCppRelease,
                metal: config_js_1.defaultLlamaCppMetalSupport,
                cuda: config_js_1.defaultLlamaCppCudaSupport
            });
            const modulePath = await (0, compileLLamaCpp_js_1.getCompiledLlamaCppBinaryPath)();
            if (modulePath == null) {
                throw new Error("Failed to download and compile llama.cpp");
            }
            return nodeRequire(modulePath);
        }
    }
    return nodeRequire(modulePath);
}
exports.loadBin = loadBin;
