"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildDefaults = void 0;
const config_js_1 = require("../config.js");
async function getBuildDefaults() {
    return {
        repo: config_js_1.defaultLlamaCppGitHubRepo,
        release: config_js_1.defaultLlamaCppRelease,
        metalSupport: config_js_1.defaultLlamaCppMetalSupport,
        cudaSupport: config_js_1.defaultLlamaCppCudaSupport
    };
}
exports.getBuildDefaults = getBuildDefaults;
