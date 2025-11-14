import { ChatMessage, ModelMapping } from "@/interfaces/interfaces";
import React, { createContext, useContext, useState } from "react";

interface ChatContextType {
  messages: ChatMessage[];
  chatId: string | null;
  setMessages: (messages: ChatMessage[]) => void;
  setChatId: (chatId: string | null) => void;
  model: ModelMapping | null;
  setModel: (model: ModelMapping | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [model, setModel] = useState<ModelMapping | null>({
    id: "gpt351106",
    name: "GPT-3.5 Turbo",
  });

  const setMessagesHandler = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
  };
  const setChatIdHandler = (newChatId: string | null) => {
    setChatId(newChatId);
  };
  const setModelHandler = (model: ModelMapping | null) => {
    setModel(model);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        chatId,
        model,
        setMessages: setMessagesHandler,
        setChatId: setChatIdHandler,
        setModel: setModelHandler,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("ChatContext must be used within a ChatProvider");
  }
  return context;
}
