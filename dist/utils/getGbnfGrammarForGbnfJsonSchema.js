"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGbnfGrammarForGbnfJsonSchema = void 0;
const getGbnfJsonTerminalForGbnfJsonSchema_js_1 = require("./gbnfJson/utils/getGbnfJsonTerminalForGbnfJsonSchema.js");
const GbnfGrammarGenerator_js_1 = require("./gbnfJson/GbnfGrammarGenerator.js");
function getGbnfGrammarForGbnfJsonSchema(schema) {
    const grammarGenerator = new GbnfGrammarGenerator_js_1.GbnfGrammarGenerator();
    const rootTerminal = (0, getGbnfJsonTerminalForGbnfJsonSchema_js_1.getGbnfJsonTerminalForGbnfJsonSchema)(schema, grammarGenerator);
    const rootGrammar = rootTerminal.getGrammar(grammarGenerator);
    const rules = [{
            name: "root",
            grammar: rootGrammar + " [\\n]".repeat(4) + " [\\n]*"
        }];
    for (const [ruleName, grammar] of grammarGenerator.rules.entries()) {
        if (grammar == null)
            continue;
        rules.push({
            name: ruleName,
            grammar
        });
    }
    const ruleStrings = rules.map((rule) => rule.name + " ::= " + rule.grammar);
    const gbnf = ruleStrings.join("\n");
    return gbnf;
}
exports.getGbnfGrammarForGbnfJsonSchema = getGbnfGrammarForGbnfJsonSchema;
