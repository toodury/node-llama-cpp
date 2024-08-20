"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBinariesGithubRelease = exports.getBinariesGithubRelease = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_js_1 = require("../config.js");
async function getBinariesGithubRelease() {
    const binariesGithubRelease = await fs_extra_1.default.readJson(config_js_1.binariesGithubReleasePath);
    return binariesGithubRelease.release;
}
exports.getBinariesGithubRelease = getBinariesGithubRelease;
async function setBinariesGithubRelease(release) {
    const binariesGithubReleaseJson = {
        release: release
    };
    await fs_extra_1.default.writeJson(config_js_1.binariesGithubReleasePath, binariesGithubReleaseJson, {
        spaces: 4
    });
}
exports.setBinariesGithubRelease = setBinariesGithubRelease;
