"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbnfGrammarGenerator = void 0;
class GbnfGrammarGenerator {
    rules = new Map();
    ruleId = 0;
    generateRuleName() {
        const ruleId = this.ruleId;
        this.ruleId++;
        return `rule${ruleId}`;
    }
}
exports.GbnfGrammarGenerator = GbnfGrammarGenerator;
