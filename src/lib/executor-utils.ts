import {
  BotAction,
  ChatMessage,
  Scenario,
  prompt,
} from "@/interfaces/interfaces";
import { getAICompletion } from "./ai-utils";

// Example usage
const exampleAction: BotAction = {
  name: "ExampleAction",
  url: "https://example.com/api/action",
  headers: ["Authorization", "Content-Type"],
  payload: ["messageId", "userId"],
  messageType: "view",
  category: "user",
  method: "POST",
  actionPrompt: {
    name: "exampleAction",
    value: "{}",
    description: "This is an example action prompt.",
  },
};

const exampleTypePrompt: prompt = {
  name: "exampleType",
  value: "view",
  description: "This is an example type prompt.",
};

const exampleCategoryPrompt: prompt = {
  name: "exampleCategory",
  value: "user",
  description: "This is an example category prompt.",
};

const exampleMessages: ChatMessage[] = [
  { content: "Hello, how can I help you?", role: "assistant", id: "msg1" },
  { content: "I need assistance with my order.", role: "user", id: "msg2" },
];

export async function buildScenario(
  action: BotAction,
  typePrompt: prompt,
  categoryPrompt: prompt,
  userMessages: ChatMessage[],
): Promise<Scenario> {
  const scenario: Scenario = {
    messages: userMessages ?? exampleMessages,
    messageType: action.messageType ?? exampleAction.messageType,
    category: action.category ?? exampleAction.category,
    typePrompt: typePrompt ?? exampleTypePrompt,
    categoryPrompt: categoryPrompt ?? exampleCategoryPrompt,
    action: action ?? exampleAction,
  };

  return scenario;
}

export async function executeScenario(
  scenario: Scenario,
  deploymentId: string = "gpt351106",
): Promise<ChatMessage> {
  // execute action
  // retrieve action data
  // add it to the messages
  // add prompts to the messages
  // append user message as a last one
  // get correct ai reply
  // servers to be sent using markdown
  return getAICompletion(scenario.messages, deploymentId);
}
