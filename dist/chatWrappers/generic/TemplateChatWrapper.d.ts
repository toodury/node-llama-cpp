import { ChatWrapperGenerateContextStateOptions, ChatWrapperGeneratedContextState, ChatWrapperSettings } from "../../types.js";
import { ChatWrapper } from "../../ChatWrapper.js";
import { ChatHistoryFunctionCallMessageTemplate } from "./utils/chatHistoryFunctionCallMessageTemplate.js";
export type TemplateChatWrapperOptions = {
    template: `${"" | `${string}{{systemPrompt}}`}${string}{{history}}${string}{{completion}}${string}`;
    historyTemplate: {
        system: `${string}{{message}}${string}`;
        user: `${string}{{message}}${string}`;
        model: `${string}{{message}}${string}`;
    };
    functionCallMessageTemplate?: ChatHistoryFunctionCallMessageTemplate;
    joinAdjacentMessagesOfTheSameType?: boolean;
};
/**
 * A chat wrapper based on a simple template.
 * @example
 * <span v-pre>
 *
 * ```ts
 * import {TemplateChatWrapper} from "node-llama-cpp";
 *
 * const chatWrapper = new TemplateChatWrapper({
 *     template: "{{systemPrompt}}\n{{history}}model: {{completion}}\nuser: ",
 *     historyTemplate: {
 *         system: "system: {{message}}\n",
 *         user: "user: {{message}}\n",
 *         model: "model: {{message}}\n"
 *     },
 *     // functionCallMessageTemplate: { // optional
 *     //     call: "[[call: {{functionName}}({{functionParams}})]]",
 *     //     result: " [[result: {{functionCallResult}}]]"
 *     // }
 * });
 * ```
 *
 * </span>
 *
 * **<span v-pre>`{{systemPrompt}}`</span>** is optional and is replaced with the first system message
 * (when is does, that system message is not included in the history).
 *
 * **<span v-pre>`{{history}}`</span>** is replaced with the chat history.
 * Each message in the chat history is converted using the template passed to `historyTemplate` for the message role,
 * and all messages are joined together.
 *
 * **<span v-pre>`{{completion}}`</span>** is where the model's response is generated.
 * The text that comes after <span v-pre>`{{completion}}`</span> is used to determine when the model has finished generating the response,
 * and thus is mandatory.
 *
 * **`functionCallMessageTemplate`** is used to specify the format in which functions can be called by the model and
 * how their results are fed to the model after the function call.
 */
export declare class TemplateChatWrapper extends ChatWrapper {
    readonly wrapperName = "Template";
    readonly settings: ChatWrapperSettings;
    readonly template: TemplateChatWrapperOptions["template"];
    readonly historyTemplate: Readonly<TemplateChatWrapperOptions["historyTemplate"]>;
    readonly joinAdjacentMessagesOfTheSameType: boolean;
    constructor({ template, historyTemplate, functionCallMessageTemplate, joinAdjacentMessagesOfTheSameType }: TemplateChatWrapperOptions);
    generateContextState({ chatHistory, availableFunctions, documentFunctionParams }: ChatWrapperGenerateContextStateOptions): ChatWrapperGeneratedContextState;
}
