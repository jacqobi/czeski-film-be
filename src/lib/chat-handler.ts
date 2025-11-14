import { User } from "@/interfaces/interfaces";
import { getAICompletion } from "./ai-utils";
import { classifyMessage, executeAction } from "./classificator-utils";

export async function handleMessage(
  messageText: string,
  user: User,
  messages: any[],
  modelId: string,
) {
  try {
    const msgCategory: string = await classifyMessage(messageText, user);
    console.log("Message category:", msgCategory);
    const actionOutput: string = await executeAction(
      messages,
      msgCategory,
      user,
      messageText,
    );
    console.log("Action output:", actionOutput);
    const replyPrompt: string = `Create a reply for users message "${messageText}" based on the action output: ${JSON.stringify(
      actionOutput,
    )}`;
    return await getAICompletion(replyPrompt, modelId || "gpt351106");
  } catch (error) {
    console.error("Error during message processing:", error);
  }
}
