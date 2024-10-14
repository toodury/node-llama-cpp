import { Llama } from "../../bindings/Llama.js";
import { GgufFileInfo } from "../types/GgufFileInfoTypes.js";
import { GgufInsightsConfigurationResolver } from "./GgufInsightsConfigurationResolver.js";
export type GgufInsightsResourceRequirements = {
    cpuRam: number;
    gpuVram: number;
};
export declare class GgufInsights {
    private constructor();
    /**
     * Get warnings about the model file that would affect its usage.
     *
     * Most of these warnings are also generated by `llama.cpp`
     */
    getWarnings(modelFilePath?: string): string[];
    get ggufFileInfo(): GgufFileInfo;
    get configurationResolver(): GgufInsightsConfigurationResolver;
    /** The context size the model was trained on */
    get trainContextSize(): number | undefined;
    /** The size of an embedding vector the model can produce */
    get embeddingVectorSize(): number | undefined;
    get totalLayers(): number;
    get modelSize(): number;
    get flashAttentionSupported(): boolean;
    estimateModelResourceRequirements({ gpuLayers }: {
        gpuLayers: number;
    }): GgufInsightsResourceRequirements;
    /**
     * Estimates the memory required to create a context of the given parameters based on the implementation details of `llama.cpp`.
     * The calculation doesn't include a precise estimation of the graph overhead memory, so it uses a rough estimate for that.
     * The estimation for the graph overhead memory will be improved in the future to be more precise, but it's good enough for now.
     */
    estimateContextResourceRequirements({ contextSize, modelGpuLayers, batchSize, sequences, isEmbeddingContext, includeGraphOverhead, flashAttention }: {
        contextSize: number;
        modelGpuLayers: number;
        batchSize?: number;
        sequences?: number;
        isEmbeddingContext?: boolean;
        flashAttention?: boolean;
        includeGraphOverhead?: boolean;
    }): GgufInsightsResourceRequirements;
    /**
     * @param ggufFileInfo
     * @param llama - If you already have a `Llama` instance, pass it to reuse it for the `GgufInsights` instance.
     * If you don't pass a `Llama` instance, a basic `Llama` instance is created as a fallback - it's a slim instance that
     * doesn't instantiate a `llama.cpp` backend, so it won't utilize the GPU at all, and be shared with other `GgufInsights` instances
     * that need a fallback `Llama` instance.
     */
    static from(ggufFileInfo: GgufFileInfo, llama?: Llama): Promise<GgufInsights>;
}
