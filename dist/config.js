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
exports.documentationPageUrls = exports.npxRunPrefix = exports.cliBinName = exports.defaultChatSystemPrompt = exports.customCmakeOptionsEnvVarPrefix = exports.defaultXpacksCacheDirectory = exports.defaultXpacksStoreDirectory = exports.defaultSkipDownload = exports.defaultLlamaCppCudaSupport = exports.defaultLlamaCppMetalSupport = exports.defaultLlamaCppRelease = exports.defaultLlamaCppGitHubRepo = exports.isCI = exports.xpmVersion = exports.localXpacksCacheDirectory = exports.localXpacksStoreDirectory = exports.xpackDirectory = exports.currentReleaseGitBundlePath = exports.llamaCppDirectoryTagFilePath = exports.binariesGithubReleasePath = exports.usedBinFlagJsonPath = exports.chatCommandHistoryFilePath = exports.tempDownloadDirectory = exports.llamaCppGrammarsDirectory = exports.llamaCppDirectory = exports.llamaBinsGrammarsDirectory = exports.llamaBinsDirectory = exports.llamaToolchainsDirectory = exports.llamaDirectory = void 0;
// import {fileURLToPath} from "url";
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const process_1 = __importDefault(require("process"));
const env_var_1 = __importDefault(require("env-var"));
const uuid = __importStar(require("uuid"));
const binariesGithubRelease_js_1 = require("./utils/binariesGithubRelease.js");
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = env_var_1.default.from(process_1.default.env);
exports.llamaDirectory = path.join(__dirname, "..", "llama");
exports.llamaToolchainsDirectory = path.join(exports.llamaDirectory, "toolchains");
exports.llamaBinsDirectory = path.join(__dirname, "..", "llamaBins");
exports.llamaBinsGrammarsDirectory = path.join(__dirname, "..", "llama", "grammars");
exports.llamaCppDirectory = path.join(exports.llamaDirectory, "llama.cpp");
exports.llamaCppGrammarsDirectory = path.join(exports.llamaDirectory, "llama.cpp", "grammars");
exports.tempDownloadDirectory = path.join(os.tmpdir(), "node-llama-cpp", uuid.v4());
exports.chatCommandHistoryFilePath = path.join(os.homedir(), ".node-llama-cpp.chat_repl_history");
exports.usedBinFlagJsonPath = path.join(exports.llamaDirectory, "usedBin.json");
exports.binariesGithubReleasePath = path.join(exports.llamaDirectory, "binariesGithubRelease.json");
exports.llamaCppDirectoryTagFilePath = path.join(exports.llamaDirectory, "llama.cpp.tag.json");
exports.currentReleaseGitBundlePath = path.join(exports.llamaDirectory, "gitRelease.bundle");
exports.xpackDirectory = path.join(exports.llamaDirectory, "xpack");
exports.localXpacksStoreDirectory = path.join(exports.xpackDirectory, "store");
exports.localXpacksCacheDirectory = path.join(exports.xpackDirectory, "cache");
exports.xpmVersion = "^0.16.3";
exports.isCI = env.get("CI")
    .default("false")
    .asBool();
exports.defaultLlamaCppGitHubRepo = env.get("NODE_LLAMA_CPP_REPO")
    .default("ggerganov/llama.cpp")
    .asString();
exports.defaultLlamaCppRelease = '';
(0, binariesGithubRelease_js_1.getBinariesGithubRelease)().then((res) => {
    exports.defaultLlamaCppRelease = env.get("NODE_LLAMA_CPP_REPO_RELEASE")
        .default(res)
        .asString();
});
// export const defaultLlamaCppRelease = env.get("NODE_LLAMA_CPP_REPO_RELEASE")
//     .default(returnBinary())
//     .asString();
exports.defaultLlamaCppMetalSupport = env.get("NODE_LLAMA_CPP_METAL")
    .default(process_1.default.platform === "darwin" ? "true" : "false")
    .asBool();
exports.defaultLlamaCppCudaSupport = env.get("NODE_LLAMA_CPP_CUDA")
    .default("false")
    .asBool();
exports.defaultSkipDownload = env.get("NODE_LLAMA_CPP_SKIP_DOWNLOAD")
    .default("false")
    .asBool();
exports.defaultXpacksStoreDirectory = env.get("NODE_LLAMA_CPP_XPACKS_STORE_FOLDER")
    .default(exports.localXpacksStoreDirectory)
    .asString();
exports.defaultXpacksCacheDirectory = env.get("NODE_LLAMA_CPP_XPACKS_CACHE_FOLDER")
    .default(exports.localXpacksCacheDirectory)
    .asString();
exports.customCmakeOptionsEnvVarPrefix = "NODE_LLAMA_CPP_CMAKE_OPTION_";
exports.defaultChatSystemPrompt = "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible.\n" +
    "If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. " +
    "If you don't know the answer to a question, please don't share false information.";
exports.cliBinName = "node-llama-cpp";
exports.npxRunPrefix = "npx --no ";
const documentationUrl = "https://withcatai.github.io/node-llama-cpp";
exports.documentationPageUrls = {
    CUDA: documentationUrl + "/guide/CUDA"
};
