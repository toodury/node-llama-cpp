export var GgufArchitectureType;
(function (GgufArchitectureType) {
    GgufArchitectureType["llama"] = "llama";
    GgufArchitectureType["falcon"] = "falcon";
    GgufArchitectureType["grok"] = "grok";
    GgufArchitectureType["gpt2"] = "gpt2";
    GgufArchitectureType["gptj"] = "gptj";
    GgufArchitectureType["gptneox"] = "gptneox";
    GgufArchitectureType["mpt"] = "mpt";
    GgufArchitectureType["baichuan"] = "baichuan";
    GgufArchitectureType["starcoder"] = "starcoder";
    GgufArchitectureType["refact"] = "refact";
    GgufArchitectureType["bert"] = "bert";
    GgufArchitectureType["nomicBert"] = "nomic-bert";
    GgufArchitectureType["jinaBertV2"] = "jina-bert-v2";
    GgufArchitectureType["bloom"] = "bloom";
    GgufArchitectureType["stablelm"] = "stablelm";
    GgufArchitectureType["qwen"] = "qwen";
    GgufArchitectureType["qwen2"] = "qwen2";
    GgufArchitectureType["qwen2moe"] = "qwen2moe";
    GgufArchitectureType["phi2"] = "phi2";
    GgufArchitectureType["phi3"] = "phi3";
    GgufArchitectureType["plamo"] = "plamo";
    GgufArchitectureType["codeshell"] = "codeshell";
    GgufArchitectureType["orion"] = "orion";
    GgufArchitectureType["internlm2"] = "internlm2";
    GgufArchitectureType["minicpm"] = "minicpm";
    GgufArchitectureType["minicpm3"] = "minicpm3";
    GgufArchitectureType["gemma"] = "gemma";
    GgufArchitectureType["gemma2"] = "gemma2";
    GgufArchitectureType["starcoder2"] = "starcoder2";
    GgufArchitectureType["mamba"] = "mamba";
    GgufArchitectureType["xverse"] = "xverse";
    GgufArchitectureType["commandR"] = "command-r";
    GgufArchitectureType["dbrx"] = "dbrx";
    GgufArchitectureType["olmo"] = "olmo";
    GgufArchitectureType["olmoe"] = "olmoe";
    GgufArchitectureType["openelm"] = "openelm";
    GgufArchitectureType["arctic"] = "arctic";
    GgufArchitectureType["deepseek2"] = "deepseek2";
    GgufArchitectureType["chatglm"] = "chatglm";
    GgufArchitectureType["bitnet"] = "bitnet";
    GgufArchitectureType["t5"] = "t5";
    GgufArchitectureType["t5encoder"] = "t5encoder";
    GgufArchitectureType["jais"] = "jais";
    GgufArchitectureType["nemotron"] = "nemotron";
    GgufArchitectureType["exaone"] = "exaone";
    GgufArchitectureType["rwkv6"] = "rwkv6";
    GgufArchitectureType["unknown"] = "(unknown)";
})(GgufArchitectureType || (GgufArchitectureType = {}));
// source: `enum llama_ftype` in `llama.h` in the `llama.cpp` source code
export var GgufFileType;
(function (GgufFileType) {
    GgufFileType[GgufFileType["ALL_F32"] = 0] = "ALL_F32";
    GgufFileType[GgufFileType["MOSTLY_F16"] = 1] = "MOSTLY_F16";
    GgufFileType[GgufFileType["MOSTLY_Q4_0"] = 2] = "MOSTLY_Q4_0";
    GgufFileType[GgufFileType["MOSTLY_Q4_1"] = 3] = "MOSTLY_Q4_1";
    GgufFileType[GgufFileType["MOSTLY_Q4_1_SOME_F16"] = 4] = "MOSTLY_Q4_1_SOME_F16";
    GgufFileType[GgufFileType["MOSTLY_Q4_2"] = 5] = "MOSTLY_Q4_2";
    GgufFileType[GgufFileType["MOSTLY_Q4_3"] = 6] = "MOSTLY_Q4_3";
    GgufFileType[GgufFileType["MOSTLY_Q8_0"] = 7] = "MOSTLY_Q8_0";
    GgufFileType[GgufFileType["MOSTLY_Q5_0"] = 8] = "MOSTLY_Q5_0";
    GgufFileType[GgufFileType["MOSTLY_Q5_1"] = 9] = "MOSTLY_Q5_1";
    GgufFileType[GgufFileType["MOSTLY_Q2_K"] = 10] = "MOSTLY_Q2_K";
    GgufFileType[GgufFileType["MOSTLY_Q3_K_S"] = 11] = "MOSTLY_Q3_K_S";
    GgufFileType[GgufFileType["MOSTLY_Q3_K_M"] = 12] = "MOSTLY_Q3_K_M";
    GgufFileType[GgufFileType["MOSTLY_Q3_K_L"] = 13] = "MOSTLY_Q3_K_L";
    GgufFileType[GgufFileType["MOSTLY_Q4_K_S"] = 14] = "MOSTLY_Q4_K_S";
    GgufFileType[GgufFileType["MOSTLY_Q4_K_M"] = 15] = "MOSTLY_Q4_K_M";
    GgufFileType[GgufFileType["MOSTLY_Q5_K_S"] = 16] = "MOSTLY_Q5_K_S";
    GgufFileType[GgufFileType["MOSTLY_Q5_K_M"] = 17] = "MOSTLY_Q5_K_M";
    GgufFileType[GgufFileType["MOSTLY_Q6_K"] = 18] = "MOSTLY_Q6_K";
    GgufFileType[GgufFileType["MOSTLY_IQ2_XXS"] = 19] = "MOSTLY_IQ2_XXS";
    GgufFileType[GgufFileType["MOSTLY_IQ2_XS"] = 20] = "MOSTLY_IQ2_XS";
    GgufFileType[GgufFileType["MOSTLY_Q2_K_S"] = 21] = "MOSTLY_Q2_K_S";
    GgufFileType[GgufFileType["MOSTLY_IQ3_XS"] = 22] = "MOSTLY_IQ3_XS";
    GgufFileType[GgufFileType["MOSTLY_IQ3_XXS"] = 23] = "MOSTLY_IQ3_XXS";
    GgufFileType[GgufFileType["MOSTLY_IQ1_S"] = 24] = "MOSTLY_IQ1_S";
    GgufFileType[GgufFileType["MOSTLY_IQ4_NL"] = 25] = "MOSTLY_IQ4_NL";
    GgufFileType[GgufFileType["MOSTLY_IQ3_S"] = 26] = "MOSTLY_IQ3_S";
    GgufFileType[GgufFileType["MOSTLY_IQ3_M"] = 27] = "MOSTLY_IQ3_M";
    GgufFileType[GgufFileType["MOSTLY_IQ2_S"] = 28] = "MOSTLY_IQ2_S";
    GgufFileType[GgufFileType["MOSTLY_IQ2_M"] = 29] = "MOSTLY_IQ2_M";
    GgufFileType[GgufFileType["MOSTLY_IQ4_XS"] = 30] = "MOSTLY_IQ4_XS";
    GgufFileType[GgufFileType["MOSTLY_IQ1_M"] = 31] = "MOSTLY_IQ1_M";
    GgufFileType[GgufFileType["MOSTLY_BF16"] = 32] = "MOSTLY_BF16";
    GgufFileType[GgufFileType["MOSTLY_Q4_0_4_4"] = 33] = "MOSTLY_Q4_0_4_4";
    GgufFileType[GgufFileType["MOSTLY_Q4_0_4_8"] = 34] = "MOSTLY_Q4_0_4_8";
    GgufFileType[GgufFileType["MOSTLY_Q4_0_8_8"] = 35] = "MOSTLY_Q4_0_8_8";
    GgufFileType[GgufFileType["LLAMA_FTYPE_MOSTLY_TQ1_0"] = 36] = "LLAMA_FTYPE_MOSTLY_TQ1_0";
    GgufFileType[GgufFileType["LLAMA_FTYPE_MOSTLY_TQ2_0"] = 37] = "LLAMA_FTYPE_MOSTLY_TQ2_0";
})(GgufFileType || (GgufFileType = {}));
export var GgufMetadataTokenizerTokenType;
(function (GgufMetadataTokenizerTokenType) {
    GgufMetadataTokenizerTokenType[GgufMetadataTokenizerTokenType["undefined"] = 0] = "undefined";
    GgufMetadataTokenizerTokenType[GgufMetadataTokenizerTokenType["normal"] = 1] = "normal";
    GgufMetadataTokenizerTokenType[GgufMetadataTokenizerTokenType["unknown"] = 2] = "unknown";
    GgufMetadataTokenizerTokenType[GgufMetadataTokenizerTokenType["control"] = 3] = "control";
    GgufMetadataTokenizerTokenType[GgufMetadataTokenizerTokenType["userDefined"] = 4] = "userDefined";
    GgufMetadataTokenizerTokenType[GgufMetadataTokenizerTokenType["unused"] = 5] = "unused";
    GgufMetadataTokenizerTokenType[GgufMetadataTokenizerTokenType["byte"] = 6] = "byte";
})(GgufMetadataTokenizerTokenType || (GgufMetadataTokenizerTokenType = {}));
export var GgufMetadataArchitecturePoolingType;
(function (GgufMetadataArchitecturePoolingType) {
    GgufMetadataArchitecturePoolingType[GgufMetadataArchitecturePoolingType["unspecified"] = -1] = "unspecified";
    GgufMetadataArchitecturePoolingType[GgufMetadataArchitecturePoolingType["none"] = 0] = "none";
    GgufMetadataArchitecturePoolingType[GgufMetadataArchitecturePoolingType["mean"] = 1] = "mean";
    GgufMetadataArchitecturePoolingType[GgufMetadataArchitecturePoolingType["cls"] = 2] = "cls";
    GgufMetadataArchitecturePoolingType[GgufMetadataArchitecturePoolingType["last"] = 3] = "last";
})(GgufMetadataArchitecturePoolingType || (GgufMetadataArchitecturePoolingType = {}));
export function isGgufMetadataOfArchitectureType(metadata, type) {
    return metadata?.general?.architecture === type;
}
//# sourceMappingURL=GgufMetadataTypes.js.map