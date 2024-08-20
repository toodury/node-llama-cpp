"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnPostInstallCommand = void 0;
const config_js_1 = require("../../config.js");
const getBin_js_1 = require("../../utils/getBin.js");
const DownloadCommand_js_1 = require("./DownloadCommand.js");
exports.OnPostInstallCommand = {
    command: "postinstall",
    describe: false,
    async handler() {
        if (config_js_1.defaultSkipDownload)
            return;
        if (await (0, getBin_js_1.getPrebuildBinPath)() != null)
            return;
        try {
            await (0, DownloadCommand_js_1.DownloadLlamaCppCommand)({
                repo: config_js_1.defaultLlamaCppGitHubRepo,
                release: config_js_1.defaultLlamaCppRelease,
                metal: config_js_1.defaultLlamaCppMetalSupport,
                cuda: config_js_1.defaultLlamaCppCudaSupport
            });
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
};
