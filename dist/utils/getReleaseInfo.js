"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReleaseInfo = void 0;
const path_1 = __importDefault(require("path"));
// import {fileURLToPath} from "url";
const fs_extra_1 = __importDefault(require("fs-extra"));
const usedBinFlag_js_1 = require("./usedBinFlag.js");
const cloneLlamaCppRepo_js_1 = require("./cloneLlamaCppRepo.js");
const binariesGithubRelease_js_1 = require("./binariesGithubRelease.js");
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
async function getReleaseInfo() {
    const [usedBinFlag, moduleVersion] = await Promise.all([
        (0, usedBinFlag_js_1.getUsedBinFlag)(),
        getModuleVersion()
    ]);
    const release = usedBinFlag === "prebuiltBinaries"
        ? await (0, binariesGithubRelease_js_1.getBinariesGithubRelease)()
        : (await (0, cloneLlamaCppRepo_js_1.getClonedLlamaCppRepoReleaseTag)() ?? await (0, binariesGithubRelease_js_1.getBinariesGithubRelease)());
    return {
        llamaCpp: {
            binarySource: usedBinFlag === "prebuiltBinaries"
                ? "included"
                : "builtLocally",
            release
        },
        moduleVersion
    };
}
exports.getReleaseInfo = getReleaseInfo;
async function getModuleVersion() {
    const packageJson = await fs_extra_1.default.readJson(path_1.default.join(__dirname, "..", "..", "package.json"));
    return packageJson.version;
}
