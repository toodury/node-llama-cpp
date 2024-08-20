"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlamaGrammar = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const getGrammarsFolder_js_1 = require("../utils/getGrammarsFolder.js");
const LlamaBins_js_1 = require("./LlamaBins.js");
class LlamaGrammar {
    /** @internal */
    _grammar;
    _stopStrings;
    _trimWhitespaceSuffix;
    _grammarText;
    /**
     * > GBNF files are supported.
     * > More info here: [github:ggerganov/llama.cpp:grammars/README.md](
     * > https://github.com/ggerganov/llama.cpp/blob/f5fe98d11bdf9e7797bcfb05c0c3601ffc4b9d26/grammars/README.md)
     * @param {object} options
     * @param {string} options.grammar - GBNF grammar
     * @param {string[]} [options.stopStrings] - Consider any of these texts as EOS for the generated out.
     * Only supported by `LlamaChatSession`
     * @param {boolean} [options.trimWhitespaceSuffix] - Trim whitespace from the end of the generated text.
     * Only supported by `LlamaChatSession`
     * @param {boolean} [options.printGrammar] - print the grammar to stdout
     */
    constructor({ grammar, stopStrings = [], trimWhitespaceSuffix = false, printGrammar = false }) {
        this._grammar = new LlamaBins_js_1.LLAMAGrammar(grammar, {
            printGrammar
        });
        this._stopStrings = stopStrings ?? [];
        this._trimWhitespaceSuffix = trimWhitespaceSuffix;
        this._grammarText = grammar;
    }
    get grammar() {
        return this._grammarText;
    }
    get stopStrings() {
        return this._stopStrings;
    }
    get trimWhitespaceSuffix() {
        return this._trimWhitespaceSuffix;
    }
    static async getFor(type) {
        const grammarsFolder = await (0, getGrammarsFolder_js_1.getGrammarsFolder)();
        const grammarFile = path_1.default.join(grammarsFolder, type + ".gbnf");
        if (await fs_extra_1.default.pathExists(grammarFile)) {
            const grammar = await fs_extra_1.default.readFile(grammarFile, "utf8");
            return new LlamaGrammar({
                grammar,
                stopStrings: ["\n".repeat(10)],
                trimWhitespaceSuffix: true
            });
        }
        throw new Error(`Grammar file for type "${type}" was not found in "${grammarsFolder}"`);
    }
}
exports.LlamaGrammar = LlamaGrammar;
