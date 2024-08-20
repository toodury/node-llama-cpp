import {
    loadBin,
    type LLAMAModel,
    type LLAMAContext,
    type LLAMAGrammar,
    type LLAMAGrammarEvaluationState,
    LlamaCppNodeModule
} from "../utils/getBin.js";
export let llamaCppNode: LlamaCppNodeModule;
let LLAMAModel: LLAMAModel, LLAMAContext: LLAMAContext;
let LLAMAGrammar: LLAMAGrammar, LLAMAGrammarEvaluationState: LLAMAGrammarEvaluationState;
loadBin().then((res: LlamaCppNodeModule) => {
    llamaCppNode = res;
    LLAMAModel = res.LLAMAModel;
    LLAMAContext = res.LLAMAContext;
    LLAMAGrammar = res.LLAMAGrammar;
    LLAMAGrammarEvaluationState = res.LLAMAGrammarEvaluationState;
});
// export const llamaCppNode = await loadBin();

export {LLAMAModel, LLAMAContext, LLAMAGrammar, LLAMAGrammarEvaluationState};
