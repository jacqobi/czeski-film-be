export interface ChatMessage {
  content: string;
  role: string;
  id?: string;
}

export interface User {
  fullName: string;
  isPO: boolean;
  isLinuxOps: boolean;
}

export type MessageType = "view" | "schedule" | "unschedule" | "none";

export type Category =
  | "user"
  | "order"
  | "machine"
  | "pause-toggle"
  | "patch"
  | "check"
  | "health"
  | "misc";

export interface prompt {
  name: string;
  value: string;
  description: string;
}

export interface BotAction {
  name: string;
  url: string;
  headers: string[]; // i only mean keys here
  payload: string[]; // i only mean keys here
  messageType: MessageType;
  category: Category;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  actionPrompt: prompt;
}

export interface Scenario {
  messages: ChatMessage[]; // we will be storing the whole array
  messageType: MessageType;
  category: Category;
  typePrompt: prompt;
  categoryPrompt: prompt;
  action: BotAction;
}

export interface DBChat {
  id: string;
  user_id: string;
  chat_name: string;
  created_at: Date;
  updated_at: Date;
}
export interface DBMessage {
  id: string;
  chat_id: string;
  content: string;
  created_at: Date;
  role: "user" | "assistant";
  updated_at: Date;
}

/**
 * Converts a DBMessage to a ChatMessage.
 * @param {DBMessage} dbMessage The message from the database.
 * @returns {ChatMessage} The converted chat message.
 */
export function convertToChatMessage(dbMessage: DBMessage): ChatMessage {
  return {
    content: dbMessage.content,
    role: dbMessage.role,
  };
}

/**
 * Converts a ChatMessage to a DBMessage.
 * @param {ChatMessage} chatMessage The chat message from OpenAI.
 * @param {string} chatId The ID of the chat this message belongs to.
 * @returns {DBMessage} The converted DB message.
 */
export function convertToDBMessage(
  chatMessage: ChatMessage,
  chatId: string,
): DBMessage {
  return {
    id: chatMessage.id ?? crypto.randomUUID(),
    chat_id: chatId,
    content: chatMessage.content,
    role: chatMessage.role as "user" | "assistant",
    created_at: new Date(), // Assuming current date for new messages
    updated_at: new Date(), // Assuming current date for new messages
  };
}

export interface ModelMapping {
  id: string;
  name: string;
}

export const modelMappings: ModelMapping[] = [
  { id: "gpt4o20240513", name: "GPT-4o" },
];

export enum MessageTypesEnum {
  "schedule-server",
  "schedule-multiple-servers",
  "unschedule-server",
  "view-server",
  "view-multiple-servers",
  "view-backend-health",
  "view-server-orders",
  "view-order-by-id",
  "global-pause-on",
  "global-pause-off",
  "create-change-request",
  "update-change-request",
  "view-change-request",
  "miscellaneous",
}
