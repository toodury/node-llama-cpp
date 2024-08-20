"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnCommand = void 0;
const cross_spawn_1 = __importDefault(require("cross-spawn"));
function spawnCommand(command, args, cwd, env = process.env) {
    function getCommandString() {
        let res = command;
        for (const arg of args) {
            if (arg.includes(" ")) {
                res += ` "${arg.split('"').join('\\"')}"`;
            }
            else {
                res += ` ${arg}`;
            }
        }
        return res;
    }
    return new Promise((resolve, reject) => {
        const child = (0, cross_spawn_1.default)(command, args, {
            stdio: "inherit",
            cwd,
            env,
            detached: false,
            windowsHide: true
        });
        child.on("exit", (code) => {
            if (code == 0)
                resolve();
            else
                reject(new Error(`Command ${getCommandString()} exited with code ${code}`));
        });
        child.on("error", reject);
        child.on("disconnect", () => reject(new Error(`Command ${getCommandString()} disconnected`)));
        child.on("close", code => {
            if (code == 0)
                resolve();
            else
                reject(new Error(`Command ${getCommandString()} closed with code ${code}`));
        });
    });
}
exports.spawnCommand = spawnCommand;
