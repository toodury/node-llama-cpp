#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {fileURLToPath} from "url";
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
// eslint-disable-next-line node/file-extension-in-import
const helpers_1 = require("yargs/helpers");
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_js_1 = require("../config.js");
const DownloadCommand_js_1 = require("./commands/DownloadCommand.js");
const BuildCommand_js_1 = require("./commands/BuildCommand.js");
const OnPostInstallCommand_js_1 = require("./commands/OnPostInstallCommand.js");
const ClearCommand_js_1 = require("./commands/ClearCommand.js");
const ChatCommand_js_1 = require("./commands/ChatCommand.js");
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = fs_extra_1.default.readJSONSync(path_1.default.join(__dirname, "..", "..", "package.json"));
const yarg = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv));
yarg
    .scriptName(config_js_1.cliBinName)
    .usage("Usage: $0 <command> [options]")
    .command(DownloadCommand_js_1.DownloadCommand)
    .command(BuildCommand_js_1.BuildCommand)
    .command(ClearCommand_js_1.ClearCommand)
    .command(ChatCommand_js_1.ChatCommand)
    .command(OnPostInstallCommand_js_1.OnPostInstallCommand)
    .recommendCommands()
    .demandCommand(1)
    .strict()
    .strictCommands()
    .alias("v", "version")
    .help("h")
    .alias("h", "help")
    .version(packageJson.version)
    .wrap(Math.min(100, yarg.terminalWidth()))
    .parse();
