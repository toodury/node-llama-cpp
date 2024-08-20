"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplHistory = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const withLock_js_1 = require("./withLock.js");
const emptyHistory = {
    history: []
};
class ReplHistory {
    _filePath;
    _fileContent;
    constructor(filePath, fileContent) {
        this._filePath = filePath;
        this._fileContent = fileContent;
    }
    async add(line) {
        if (this._filePath == null) {
            this._fileContent = this._addItemToHistory(line, this._fileContent);
            return;
        }
        await (0, withLock_js_1.withLock)(this, "file", async () => {
            try {
                const json = parseReplJsonfile(await fs_extra_1.default.readJSON(this._filePath));
                this._fileContent = this._addItemToHistory(line, json);
                await fs_extra_1.default.writeJSON(this._filePath, this._fileContent, {
                    spaces: 4
                });
            }
            catch (err) { }
        });
    }
    get history() {
        return this._fileContent.history;
    }
    _addItemToHistory(item, fileContent) {
        const newHistory = fileContent.history.slice();
        const currentItemIndex = newHistory.indexOf(item);
        if (currentItemIndex !== -1)
            newHistory.splice(currentItemIndex, 1);
        newHistory.unshift(item);
        return {
            ...fileContent,
            history: newHistory
        };
    }
    static async load(filePath, saveAndLoadHistory = true) {
        if (!saveAndLoadHistory)
            return new ReplHistory(null, {
                history: []
            });
        try {
            if (!(await fs_extra_1.default.pathExists(filePath)))
                await fs_extra_1.default.writeJSON(filePath, emptyHistory, {
                    spaces: 4
                });
            const json = parseReplJsonfile(await fs_extra_1.default.readJSON(filePath));
            return new ReplHistory(filePath, json);
        }
        catch (err) {
            return new ReplHistory(null, {
                history: []
            });
        }
    }
}
exports.ReplHistory = ReplHistory;
function parseReplJsonfile(file) {
    if (typeof file !== "object" || file == null || !("history" in file) || !(file.history instanceof Array) || file.history.some((item) => typeof item !== "string"))
        throw new Error("Invalid ReplyHistory file");
    return file;
}
