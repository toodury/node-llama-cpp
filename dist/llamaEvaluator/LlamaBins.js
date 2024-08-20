"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLAMAGrammarEvaluationState = exports.LLAMAGrammar = exports.LLAMAContext = exports.LLAMAModel = exports.llamaCppNode = void 0;
const getBin_js_1 = require("../utils/getBin.js");
let LLAMAModel, LLAMAContext;
let LLAMAGrammar, LLAMAGrammarEvaluationState;
(0, getBin_js_1.loadBin)().then((res) => {
    exports.llamaCppNode = res;
    exports.LLAMAModel = LLAMAModel = res.LLAMAModel;
    exports.LLAMAContext = LLAMAContext = res.LLAMAContext;
    exports.LLAMAGrammar = LLAMAGrammar = res.LLAMAGrammar;
    exports.LLAMAGrammarEvaluationState = LLAMAGrammarEvaluationState = res.LLAMAGrammarEvaluationState;
});
