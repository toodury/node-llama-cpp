"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixXpackPermissions = exports.clearLocalCmake = exports.downloadCmakeIfNeeded = exports.getCmakePath = exports.hasBuiltinCmake = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const which_1 = __importDefault(require("which"));
const chalk_1 = __importDefault(require("chalk"));
const chmodrp_1 = require("chmodrp");
const config_js_1 = require("../config.js");
const spawnCommand_js_1 = require("./spawnCommand.js");
const withStatusLogs_js_1 = __importDefault(require("./withStatusLogs.js"));
async function hasBuiltinCmake() {
    try {
        const resolvedPath = await (0, which_1.default)("cmake");
        return resolvedPath !== "";
    }
    catch (err) {
        return false;
    }
}
exports.hasBuiltinCmake = hasBuiltinCmake;
async function getCmakePath() {
    try {
        const resolvedPath = await (0, which_1.default)("cmake");
        if (resolvedPath !== "")
            return resolvedPath;
    }
    catch (err) { }
    try {
        let resolvedPath = await (0, which_1.default)("cmake", {
            path: path_1.default.join(config_js_1.llamaDirectory, "xpack", "xpacks", ".bin")
        });
        if (resolvedPath.toLowerCase().endsWith(".cmd"))
            resolvedPath = (await getBinFromWindowCmd(resolvedPath, "cmake.exe")) ?? "";
        else if (resolvedPath.toLowerCase().endsWith(".ps1")) {
            const cmdFilePath = resolvedPath.slice(0, -".ps1".length) + ".cmd";
            if (await fs_extra_1.default.pathExists(cmdFilePath))
                resolvedPath = (await getBinFromWindowCmd(cmdFilePath, "cmake.exe")) ?? "";
        }
        if (resolvedPath !== "")
            return resolvedPath;
    }
    catch (err) { }
    throw new Error("cmake not found");
}
exports.getCmakePath = getCmakePath;
async function downloadCmakeIfNeeded(wrapWithStatusLogs = false) {
    try {
        await getCmakePath();
        return;
    }
    catch (err) { }
    if (!wrapWithStatusLogs)
        await downloadCmake();
    else
        await (0, withStatusLogs_js_1.default)({
            loading: chalk_1.default.blue("Downloading cmake"),
            success: chalk_1.default.blue("Downloaded cmake"),
            fail: chalk_1.default.blue("Failed to download cmake")
        }, async () => {
            await downloadCmake();
        });
}
exports.downloadCmakeIfNeeded = downloadCmakeIfNeeded;
async function clearLocalCmake() {
    await fs_extra_1.default.remove(config_js_1.localXpacksStoreDirectory);
    await fs_extra_1.default.remove(config_js_1.localXpacksCacheDirectory);
    await fs_extra_1.default.remove(path_1.default.join(config_js_1.xpackDirectory, "xpacks"));
}
exports.clearLocalCmake = clearLocalCmake;
/**
 * There's an issue where after a compilation, the cmake binaries have permissions that don't allow them to be deleted.
 * This function fixes that.
 * It should be run after each compilation.
 */
async function fixXpackPermissions() {
    try {
        await (0, chmodrp_1.chmodr)(config_js_1.localXpacksStoreDirectory, 0o777);
        await (0, chmodrp_1.chmodr)(config_js_1.localXpacksCacheDirectory, 0o777);
        await (0, chmodrp_1.chmodr)(path_1.default.join(config_js_1.xpackDirectory, "xpacks"), 0o777);
    }
    catch (err) { }
}
exports.fixXpackPermissions = fixXpackPermissions;
async function downloadCmake() {
    const xpmEnv = {
        ...process.env,
        XPACKS_STORE_FOLDER: config_js_1.defaultXpacksStoreDirectory,
        XPACKS_CACHE_FOLDER: config_js_1.defaultXpacksCacheDirectory
    };
    await (0, spawnCommand_js_1.spawnCommand)("npm", ["exec", "--yes", "--", `xpm@${config_js_1.xpmVersion}`, "install", "@xpack-dev-tools/cmake@latest", "--no-save"], config_js_1.xpackDirectory, xpmEnv);
    await fs_extra_1.default.remove(config_js_1.localXpacksCacheDirectory);
    await fixXpackPermissions();
}
async function getBinFromWindowCmd(cmdFilePath, binName) {
    const fileContent = await fs_extra_1.default.readFile(cmdFilePath, "utf8");
    const lowercaseFileContent = fileContent.toLowerCase();
    if (!lowercaseFileContent.includes(binName))
        return null;
    const lastIndexOfBinName = lowercaseFileContent.lastIndexOf(binName);
    const characterAfterBinName = fileContent[lastIndexOfBinName + binName.length];
    if (characterAfterBinName !== '"' && characterAfterBinName !== "'")
        return null;
    const startStringCharacter = fileContent.lastIndexOf(characterAfterBinName, lastIndexOfBinName);
    const binPath = fileContent.slice(startStringCharacter + 1, lastIndexOfBinName + binName.length);
    if (!await fs_extra_1.default.pathExists(binPath))
        return null;
    return binPath;
}
