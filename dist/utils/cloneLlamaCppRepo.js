"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClonedLlamaCppRepoReleaseTag = exports.cloneLlamaCppRepo = void 0;
const simple_git_1 = __importDefault(require("simple-git"));
const cli_progress_1 = __importDefault(require("cli-progress"));
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_js_1 = require("../config.js");
const gitReleaseBundles_js_1 = require("./gitReleaseBundles.js");
async function cloneLlamaCppRepo(githubOwner, githubRepo, tag, useBundles = true) {
    const gitBundleForTag = !useBundles ? null : await (0, gitReleaseBundles_js_1.getGitBundlePathForRelease)(githubOwner, githubRepo, tag);
    const remoteGitUrl = `https://github.com/${githubOwner}/${githubRepo}.git`;
    async function withGitCloneProgress(cloneName, callback) {
        const progressBar = new cli_progress_1.default.Bar({
            clearOnComplete: false,
            hideCursor: true,
            autopadding: true,
            format: `${chalk_1.default.bold("Clone {repo}")}  ${chalk_1.default.yellow("{percentage}%")} ${chalk_1.default.cyan("{bar}")} ${chalk_1.default.grey("{eta_formatted}")}`
        }, cli_progress_1.default.Presets.shades_classic);
        progressBar.start(100, 0, {
            speed: "",
            repo: `${githubOwner}/${githubRepo} (${cloneName})`
        });
        const gitWithCloneProgress = (0, simple_git_1.default)({
            progress({ progress, total, processed }) {
                const totalProgress = (processed / 100) + (progress / total);
                progressBar.update(Math.floor(totalProgress * 10000) / 100);
            }
        });
        try {
            const res = await callback(gitWithCloneProgress);
            progressBar.update(100);
            return res;
        }
        finally {
            progressBar.stop();
        }
    }
    if (gitBundleForTag != null) {
        try {
            await withGitCloneProgress("local bundle", async (gitWithCloneProgress) => {
                await gitWithCloneProgress.clone(gitBundleForTag, config_js_1.llamaCppDirectory, {
                    "--quiet": null
                });
                await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).removeRemote("origin");
            });
            return;
        }
        catch (err) {
            await fs_extra_1.default.remove(config_js_1.llamaCppDirectory);
            await fs_extra_1.default.remove(config_js_1.llamaCppDirectoryTagFilePath);
            console.error("Failed to clone git bundle, cloning from GitHub instead", err);
            printCloneErrorHelp(String(err));
        }
    }
    try {
        await withGitCloneProgress("GitHub", async (gitWithCloneProgress) => {
            await gitWithCloneProgress.clone(remoteGitUrl, config_js_1.llamaCppDirectory, {
                "--depth": 1,
                "--branch": tag,
                "--quiet": null
            });
        });
    }
    catch (err) {
        printCloneErrorHelp(String(err));
        throw err;
    }
    try {
        const clonedLlamaCppRepoTagJson = {
            tag
        };
        await fs_extra_1.default.writeJson(config_js_1.llamaCppDirectoryTagFilePath, clonedLlamaCppRepoTagJson, {
            spaces: 4
        });
    }
    catch (err) {
        console.error("Failed to write llama.cpp tag file", err);
        throw err;
    }
}
exports.cloneLlamaCppRepo = cloneLlamaCppRepo;
function printCloneErrorHelp(error) {
    // This error happens with some docker images where the current user is different
    // from the owner of the files due to mounting a volume.
    // In such cases, print a helpful message to help the user resolve the issue.
    if (error.toLowerCase().includes("detected dubious ownership in repository"))
        console.info("\n" +
            chalk_1.default.grey("[node-llama-cpp]") + chalk_1.default.yellow(" To fix this issue, try running this command to fix it for the current module directory:") + "\n" +
            'git config --global --add safe.directory "' + config_js_1.llamaCppDirectory + '"\n\n' +
            chalk_1.default.yellow("Or run this command to fix it everywhere:") + "\n" +
            'git config --global --add safe.directory "*"');
}
async function getClonedLlamaCppRepoReleaseTag() {
    if (!(await fs_extra_1.default.pathExists(config_js_1.llamaCppDirectoryTagFilePath)))
        return null;
    try {
        const clonedLlamaCppRepoTagJson = await fs_extra_1.default.readJson(config_js_1.llamaCppDirectoryTagFilePath);
        return clonedLlamaCppRepoTagJson.tag;
    }
    catch (err) {
        console.error("Failed to read llama.cpp tag file", err);
        return null;
    }
}
exports.getClonedLlamaCppRepoReleaseTag = getClonedLlamaCppRepoReleaseTag;
