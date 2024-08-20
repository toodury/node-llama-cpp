"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadLlamaCppCommand = exports.DownloadCommand = void 0;
const process_1 = __importDefault(require("process"));
const octokit_1 = require("octokit");
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const config_js_1 = require("../../config.js");
const compileLLamaCpp_js_1 = require("../../utils/compileLLamaCpp.js");
const withOra_js_1 = __importDefault(require("../../utils/withOra.js"));
const clearTempFolder_js_1 = require("../../utils/clearTempFolder.js");
const binariesGithubRelease_js_1 = require("../../utils/binariesGithubRelease.js");
const cmake_js_1 = require("../../utils/cmake.js");
const withStatusLogs_js_1 = __importDefault(require("../../utils/withStatusLogs.js"));
const state_js_1 = require("../../state.js");
const gitReleaseBundles_js_1 = require("../../utils/gitReleaseBundles.js");
const cloneLlamaCppRepo_js_1 = require("../../utils/cloneLlamaCppRepo.js");
exports.DownloadCommand = {
    command: "download",
    describe: "Download a release of llama.cpp and compile it",
    builder(yargs) {
        const isInDocumentationMode = (0, state_js_1.getIsInDocumentationMode)();
        return yargs
            .option("repo", {
            type: "string",
            default: config_js_1.defaultLlamaCppGitHubRepo,
            description: "The GitHub repository to download a release of llama.cpp from. Can also be set via the NODE_LLAMA_CPP_REPO environment variable"
        })
            .option("release", {
            type: "string",
            default: isInDocumentationMode ? "<current build>" : config_js_1.defaultLlamaCppRelease,
            description: "The tag of the llama.cpp release to download. Set to \"latest\" to download the latest release. Can also be set via the NODE_LLAMA_CPP_REPO_RELEASE environment variable"
        })
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
            hidden: process_1.default.platform !== "darwin" && !isInDocumentationMode,
            description: "Compile llama.cpp with Metal support. Enabled by default on macOS. Can be disabled with \"--no-metal\". Can also be set via the NODE_LLAMA_CPP_METAL environment variable"
        })
            .option("cuda", {
            type: "boolean",
            default: config_js_1.defaultLlamaCppCudaSupport,
            description: "Compile llama.cpp with CUDA support. Can also be set via the NODE_LLAMA_CPP_CUDA environment variable"
        })
            .option("skipBuild", {
            alias: "sb",
            type: "boolean",
            default: false,
            description: "Skip building llama.cpp after downloading it"
        })
            .option("noBundle", {
            alias: "nb",
            type: "boolean",
            default: false,
            description: "Download a llama.cpp release only from GitHub, even if a local git bundle exists for the release"
        })
            .option("updateBinariesReleaseMetadataAndSaveGitBundle", {
            type: "boolean",
            hidden: true,
            default: false,
            description: "Update the binariesGithubRelease.json file with the release of llama.cpp that was downloaded"
        });
    },
    handler: DownloadLlamaCppCommand
};
async function DownloadLlamaCppCommand({ repo = config_js_1.defaultLlamaCppGitHubRepo, release = config_js_1.defaultLlamaCppRelease, arch = undefined, nodeTarget = undefined, metal = config_js_1.defaultLlamaCppMetalSupport, cuda = config_js_1.defaultLlamaCppCudaSupport, skipBuild = false, noBundle = false, updateBinariesReleaseMetadataAndSaveGitBundle = false }) {
    const useBundle = noBundle != true;
    const octokit = new octokit_1.Octokit();
    const [githubOwner, githubRepo] = repo.split("/");
    console.log(`${chalk_1.default.yellow("Repo:")} ${repo}`);
    console.log(`${chalk_1.default.yellow("Release:")} ${release}`);
    if (!skipBuild) {
        if (metal && process_1.default.platform === "darwin") {
            console.log(`${chalk_1.default.yellow("Metal:")} enabled`);
        }
        if (cuda) {
            console.log(`${chalk_1.default.yellow("CUDA:")} enabled`);
        }
    }
    console.log();
    let githubReleaseTag = (useBundle && (await (0, gitReleaseBundles_js_1.getGitBundlePathForRelease)(githubOwner, githubRepo, release)) != null)
        ? release
        : null;
    if (githubReleaseTag == null)
        await (0, withOra_js_1.default)({
            loading: chalk_1.default.blue("Fetching llama.cpp info"),
            success: chalk_1.default.blue("Fetched llama.cpp info"),
            fail: chalk_1.default.blue("Failed to fetch llama.cpp info")
        }, async () => {
            let githubRelease = null;
            try {
                if (release === "latest") {
                    githubRelease = await octokit.rest.repos.getLatestRelease({
                        owner: githubOwner,
                        repo: githubRepo
                    });
                }
                else {
                    githubRelease = await octokit.rest.repos.getReleaseByTag({
                        owner: githubOwner,
                        repo: githubRepo,
                        tag: release
                    });
                }
            }
            catch (err) {
                console.error("Failed to fetch llama.cpp release info", err);
            }
            if (githubRelease == null) {
                throw new Error(`Failed to find release "${release}" of "${repo}"`);
            }
            if (githubRelease.data.tag_name == null) {
                throw new Error(`Failed to find tag of release "${release}" of "${repo}"`);
            }
            githubReleaseTag = githubRelease.data.tag_name;
        });
    await (0, clearTempFolder_js_1.clearTempFolder)();
    await (0, withOra_js_1.default)({
        loading: chalk_1.default.blue("Removing existing llama.cpp directory"),
        success: chalk_1.default.blue("Removed existing llama.cpp directory"),
        fail: chalk_1.default.blue("Failed to remove existing llama.cpp directory")
    }, async () => {
        await fs_extra_1.default.remove(config_js_1.llamaCppDirectory);
        await fs_extra_1.default.remove(config_js_1.llamaCppDirectoryTagFilePath);
    });
    console.log(chalk_1.default.blue("Cloning llama.cpp"));
    await (0, cloneLlamaCppRepo_js_1.cloneLlamaCppRepo)(githubOwner, githubRepo, githubReleaseTag, useBundle);
    if (!skipBuild) {
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
    }
    if (config_js_1.isCI && updateBinariesReleaseMetadataAndSaveGitBundle) {
        await (0, binariesGithubRelease_js_1.setBinariesGithubRelease)(githubReleaseTag);
        await (0, gitReleaseBundles_js_1.unshallowAndSquashCurrentRepoAndSaveItAsReleaseBundle)();
    }
    console.log();
    console.log();
    console.log(`${chalk_1.default.yellow("Repo:")} ${repo}`);
    console.log(`${chalk_1.default.yellow("Release:")} ${release}`);
    console.log();
    console.log(chalk_1.default.green("Done"));
}
exports.DownloadLlamaCppCommand = DownloadLlamaCppCommand;
