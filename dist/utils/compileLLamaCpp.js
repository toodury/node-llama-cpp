"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompiledLlamaCppBinaryPath = exports.compileLlamaCpp = void 0;
const path_1 = __importDefault(require("path"));
// import {fileURLToPath} from "url";
const process_1 = __importDefault(require("process"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const config_js_1 = require("../config.js");
const clearLlamaBuild_js_1 = require("./clearLlamaBuild.js");
const usedBinFlag_js_1 = require("./usedBinFlag.js");
const spawnCommand_js_1 = require("./spawnCommand.js");
const cmake_js_1 = require("./cmake.js");
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
async function compileLlamaCpp({ arch = process_1.default.arch, nodeTarget = process_1.default.version, setUsedBinFlag: setUsedBinFlagArg = true, metal = process_1.default.platform === "darwin", cuda = false }) {
    try {
        if (!(await fs_extra_1.default.pathExists(config_js_1.llamaCppDirectory))) {
            throw new Error(`"${config_js_1.llamaCppDirectory}" directory does not exist`);
        }
        const cmakePathArgs = await getCmakePathArgs();
        const toolchainFile = await getToolchainFileForArch(arch);
        const runtimeVersion = nodeTarget.startsWith("v") ? nodeTarget.slice("v".length) : nodeTarget;
        const cmakeCustomOptions = new Map();
        if ((metal && process_1.default.platform === "darwin") || process_1.default.env.GGML_METAL === "1")
            cmakeCustomOptions.set("GGML_METAL", "1");
        else
            cmakeCustomOptions.set("GGML_METAL", "OFF");
        if (cuda || process_1.default.env.GGML_CUDA === "1")
            cmakeCustomOptions.set("GGML_CUDA", "1");
        if (process_1.default.env.GGML_OPENBLAS === "1")
            cmakeCustomOptions.set("GGML_OPENBLAS", "1");
        if (process_1.default.env.GGML_BLAS_VENDOR != null)
            cmakeCustomOptions.set("GGML_BLAS_VENDOR", process_1.default.env.GGML_BLAS_VENDOR);
        if (process_1.default.env.GGML_CUDA_FORCE_DMMV != null)
            cmakeCustomOptions.set("GGML_CUDA_FORCE_DMMV", process_1.default.env.GGML_CUDA_FORCE_DMMV);
        if (process_1.default.env.GGML_CUDA_DMMV_X != null)
            cmakeCustomOptions.set("GGML_CUDA_DMMV_X", process_1.default.env.GGML_CUDA_DMMV_X);
        if (process_1.default.env.GGML_CUDA_MMV_Y != null)
            cmakeCustomOptions.set("GGML_CUDA_MMV_Y", process_1.default.env.GGML_CUDA_MMV_Y);
        if (process_1.default.env.GGML_CUDA_F16 != null)
            cmakeCustomOptions.set("GGML_CUDA_F16", process_1.default.env.GGML_CUDA_F16);
        if (process_1.default.env.GGML_CUDA_KQUANTS_ITER != null)
            cmakeCustomOptions.set("GGML_CUDA_KQUANTS_ITER", process_1.default.env.GGML_CUDA_KQUANTS_ITER);
        if (process_1.default.env.GGML_CUDA_PEER_MAX_BATCH_SIZE != null)
            cmakeCustomOptions.set("GGML_CUDA_PEER_MAX_BATCH_SIZE", process_1.default.env.GGML_CUDA_PEER_MAX_BATCH_SIZE);
        if (process_1.default.env.GGML_HIPBLAS === "1")
            cmakeCustomOptions.set("GGML_HIPBLAS", "1");
        if (toolchainFile != null)
            cmakeCustomOptions.set("CMAKE_TOOLCHAIN_FILE", toolchainFile);
        for (const key in process_1.default.env) {
            if (key.startsWith(config_js_1.customCmakeOptionsEnvVarPrefix)) {
                const option = key.slice(config_js_1.customCmakeOptionsEnvVarPrefix.length);
                const value = process_1.default.env[key];
                cmakeCustomOptions.set(option, value);
            }
        }
        await (0, clearLlamaBuild_js_1.clearLlamaBuild)();
        await (0, spawnCommand_js_1.spawnCommand)("npm", ["run", "-s", "cmake-js-llama", "--", "clean", "--log-level", "warn", ...cmakePathArgs], __dirname);
        await (0, spawnCommand_js_1.spawnCommand)("npm", ["run", "-s", "cmake-js-llama", "--", "compile", "--log-level", "warn", "--arch=" + arch, "--runtime-version=" + runtimeVersion, ...cmakePathArgs]
            .concat([...cmakeCustomOptions].map(([key, value]) => "--CD" + key + "=" + value)), __dirname);
        const binFilesDirPaths = [
            path_1.default.join(config_js_1.llamaDirectory, "build", "bin"),
            path_1.default.join(config_js_1.llamaDirectory, "build", "llama.cpp", "bin")
        ];
        const compiledResultDirPath = await getCompiledResultDir(true);
        for (const binFilesDirPath of binFilesDirPaths) {
            if (await fs_extra_1.default.pathExists(binFilesDirPath)) {
                const files = await fs_extra_1.default.readdir(binFilesDirPath);
                await Promise.all(files.map((fileName) => (fs_extra_1.default.copy(path_1.default.join(binFilesDirPath, fileName), path_1.default.join(compiledResultDirPath, fileName), {
                    overwrite: false
                }))));
            }
        }
        applyResultDirFixes(compiledResultDirPath, path_1.default.join(compiledResultDirPath, "__temp"));
        if (setUsedBinFlagArg) {
            await (0, usedBinFlag_js_1.setUsedBinFlag)("localBuildFromSource");
        }
    }
    catch (err) {
        if (setUsedBinFlagArg)
            await (0, usedBinFlag_js_1.setUsedBinFlag)("prebuiltBinaries");
        if (cuda)
            console.info("\n" +
                chalk_1.default.grey("[node-llama-cpp] ") +
                chalk_1.default.yellow("To resolve errors related to CUDA compilation, see the CUDA guide: ") +
                config_js_1.documentationPageUrls.CUDA);
        throw err;
    }
    finally {
        await (0, cmake_js_1.fixXpackPermissions)();
    }
}
exports.compileLlamaCpp = compileLlamaCpp;
async function getCompiledLlamaCppBinaryPath() {
    const compiledResultDirPath = await getCompiledResultDir(false);
    if (compiledResultDirPath == null)
        return null;
    const modulePath = path_1.default.join(compiledResultDirPath, "llama-addon.node");
    if (await fs_extra_1.default.pathExists(modulePath))
        return modulePath;
    return null;
}
exports.getCompiledLlamaCppBinaryPath = getCompiledLlamaCppBinaryPath;
async function getCompiledResultDir(failIfNotFound = false) {
    if (await fs_extra_1.default.pathExists(path_1.default.join(config_js_1.llamaDirectory, "build", "Release"))) {
        return path_1.default.join(config_js_1.llamaDirectory, "build", "Release");
    }
    else if (await fs_extra_1.default.pathExists(path_1.default.join(config_js_1.llamaDirectory, "build", "Debug"))) {
        return path_1.default.join(config_js_1.llamaDirectory, "build", "Debug");
    }
    if (failIfNotFound)
        throw new Error("Could not find Release or Debug directory");
    return null;
}
async function getCmakePathArgs() {
    if (await (0, cmake_js_1.hasBuiltinCmake)())
        return [];
    const cmakePath = await (0, cmake_js_1.getCmakePath)();
    if (cmakePath == null)
        return [];
    return ["--cmake-path", cmakePath];
}
async function getToolchainFileForArch(targetArch) {
    if (process_1.default.arch === targetArch)
        return null;
    const platform = process_1.default.platform;
    const hostArch = process_1.default.arch;
    const toolchainFilename = `${platform}.host-${hostArch}.target-${targetArch}.cmake`;
    const filePath = path_1.default.join(config_js_1.llamaToolchainsDirectory, toolchainFilename);
    if (await fs_extra_1.default.pathExists(filePath))
        return filePath;
    return null;
}
async function applyResultDirFixes(resultDirPath, tempDirPath) {
    const releaseDirPath = path_1.default.join(resultDirPath, "Release");
    if (await fs_extra_1.default.pathExists(releaseDirPath)) {
        await fs_extra_1.default.remove(tempDirPath);
        await fs_extra_1.default.move(releaseDirPath, tempDirPath);
        const itemNames = await fs_extra_1.default.readdir(tempDirPath);
        await Promise.all(itemNames.map((itemName) => (fs_extra_1.default.move(path_1.default.join(tempDirPath, itemName), path_1.default.join(resultDirPath, itemName), {
            overwrite: true
        }))));
        await fs_extra_1.default.remove(tempDirPath);
    }
}
