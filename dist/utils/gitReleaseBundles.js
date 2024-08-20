"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitBundlePathForRelease = exports.unshallowAndSquashCurrentRepoAndSaveItAsReleaseBundle = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const simple_git_1 = __importDefault(require("simple-git"));
const config_js_1 = require("../config.js");
const binariesGithubRelease_js_1 = require("./binariesGithubRelease.js");
async function unshallowAndSquashCurrentRepoAndSaveItAsReleaseBundle() {
    if (!(await fs_extra_1.default.pathExists(config_js_1.llamaCppDirectory)))
        throw new Error("llama.cpp directory does not exist");
    if (await fs_extra_1.default.pathExists(config_js_1.currentReleaseGitBundlePath))
        await fs_extra_1.default.remove(config_js_1.currentReleaseGitBundlePath);
    await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).addConfig("user.name", "node-llama-cpp-ci");
    await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).addConfig("user.email", "node-llama-cpp-ci@node-llama-cpp-ci.node-llama-cpp-ci");
    const currentBranch = await getCurrentTagOrBranch();
    await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).fetch(["--unshallow"]);
    const lastCommit = await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).log(["-1"]);
    const lastCommitMessage = lastCommit?.all?.[0]?.message;
    const newCommitMessage = "## SQUASHED ##\n\n" + (lastCommitMessage ?? "");
    const newCommitSha = await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).raw(["commit-tree", "HEAD^{tree}", "-m", newCommitMessage]);
    await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).reset(["--hard", newCommitSha.trim()]);
    const tags = await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).tags();
    for (const tag of tags.all) {
        await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).tag(["--delete", tag]);
    }
    const branches = await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).branch();
    for (const branch of branches.all) {
        try {
            await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).branch(["--delete", branch]);
        }
        catch (err) {
            // If the branch is not found, it's fine
            // this happens as when there are no branches git returnes an output saying so, and `simpleGit` parses it as a branch,
            // so the list may contain branches that do not exist.
            // Right now, the non-existent branch name returned called `(no`, but I wouldn't want to rely on this specific text,
            // as this is a bug in `simpleGit`.
        }
    }
    if (currentBranch != null)
        await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).tag([currentBranch]);
    await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).raw(["gc", "--aggressive", "--prune=all"]);
    await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).raw(["bundle", "create", config_js_1.currentReleaseGitBundlePath, "HEAD"]);
}
exports.unshallowAndSquashCurrentRepoAndSaveItAsReleaseBundle = unshallowAndSquashCurrentRepoAndSaveItAsReleaseBundle;
async function getGitBundlePathForRelease(githubOwner, githubRepo, release) {
    const [defaultGithubOwner, defaultGithubRepo] = config_js_1.defaultLlamaCppGitHubRepo.split("/");
    if (githubOwner !== defaultGithubOwner || githubRepo !== defaultGithubRepo)
        return null;
    const currentBundleRelease = await (0, binariesGithubRelease_js_1.getBinariesGithubRelease)();
    if (currentBundleRelease === "latest")
        return null;
    if (currentBundleRelease !== release)
        return null;
    if (!(await fs_extra_1.default.pathExists(config_js_1.currentReleaseGitBundlePath)))
        return null;
    return config_js_1.currentReleaseGitBundlePath;
}
exports.getGitBundlePathForRelease = getGitBundlePathForRelease;
async function getCurrentTagOrBranch() {
    const branch = await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).revparse(["--abbrev-ref", "HEAD"]);
    if (branch !== "HEAD")
        return branch;
    const tags = await (0, simple_git_1.default)(config_js_1.llamaCppDirectory).tag(["--points-at", "HEAD"]);
    const tagArray = tags.split("\n").filter(Boolean);
    if (tagArray.length > 0)
        return tagArray[0];
    return null;
}
