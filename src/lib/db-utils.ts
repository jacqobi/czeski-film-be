import axios, { AxiosResponse } from "axios";
import {
  ChatMessage,
  convertToChatMessage,
  DBChat,
  DBMessage,
} from "@/interfaces/interfaces";

export const API_BASE_URL = "http://OUR_DB_HOST";

export async function createChat(userId: string): Promise<DBChat> {
  try {
    const response: AxiosResponse<{ success: string; chat: DBChat }> =
      await axios.post(`${API_BASE_URL}/createChat`, { userId });
    return response.data.chat;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw new Error("Failed to create chat");
  }
}

export async function saveMessage(
  chatId: string,
  content: string,
  role: "user" | "assistant",
): Promise<void> {
  try {
    await axios.post(`${API_BASE_URL}/saveMessage`, { chatId, content, role });
  } catch (error) {
    console.error("Error saving message:", error);
    throw new Error("Failed to save message");
  }
}

export async function getChatsByUserId(userId: string): Promise<any> {
  try {
    const response: AxiosResponse<{ chats: DBChat[] }> = await axios.get(
      `${API_BASE_URL}/getChatsByUserId/${userId}`,
    );
    return response.data.chats;
  } catch (error) {
    console.error("Error getting chats:", error);
    throw new Error("Failed to get chats");
  }
}

export async function getChatMessagesByChatId(
  chatId: string,
): Promise<ChatMessage[]> {
  try {
    const response: AxiosResponse<{ messages: DBMessage[] }> = await axios.get(
      `${API_BASE_URL}/getChatMessagesByChatId/${chatId}`,
    );

    const convertedMessages = response.data.messages.map(convertToChatMessage);

    return convertedMessages;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw new Error("Failed to get messages");
  }
}

export async function deleteChatByChatId(chatId: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/deleteChatByChatId/${chatId}`);
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw new Error("Failed to delete chat");
  }
}
