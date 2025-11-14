import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageCircle, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getChatsByUserId,
  createChat,
  getChatMessagesByChatId,
  deleteChatByChatId,
} from "@/lib/db-utils"; // Adjust the import path according to your directory structure
import { DBChat } from "@/interfaces/interfaces";
import { useChat } from "@/context/ChatContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteChat?: (chatId: string) => void;
  userId: string;
}

export function Sidebar({ isOpen, onClose, userId }: SidebarProps) {
  const [chats, setChats] = useState<
    { id: string; name: string; active: boolean }[]
  >([]);
  const { setMessages, setChatId, chatId } = useChat();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getChatsByUserId(userId);
        const initialChats = chats.map((chat: DBChat) => ({
          id: chat.id,
          name: chat.chat_name ? chat.chat_name : chat.id.slice(0, 8),
          active: false,
        }));
        setChats(initialChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [userId]);

  const createNewChat = async () => {
    try {
      setMessages([]);
      const oldChatId = chatId;
      const newChat: DBChat = await createChat(userId);
      // use filter to set old chat to be inactive
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === oldChatId ? { ...chat, active: false } : chat,
        ),
      );
      setChats([
        ...chats.filter((chat) => chat.id !== newChat.id),
        {
          id: newChat.id,
          name: newChat.chat_name
            ? newChat.chat_name
            : newChat.id.substring(0, 8),
          active: true,
        },
      ]);
      setChatId(newChat.id);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const selectChat = async (chatId: string) => {
    try {
      const messages = await getChatMessagesByChatId(chatId);
      setMessages(messages);
      setChatId(chatId);
      setChats(
        chats.map((chat) => ({
          ...chat,
          active: chat.id === chatId,
        })),
      );
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    await deleteChatByChatId(chatId);
    setChats(chats.filter((chat) => chat.id !== chatId));
    setChatId(null);
    setMessages([]);
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out z-50",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={createNewChat}
          className="mb-4 flex items-center gap-2"
          variant="outline"
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {chats.map((chat) => (
              <div key={chat.id} className="group relative">
                <Button
                  variant={chat.active ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2 pr-8"
                  onClick={() => selectChat(chat.id)}
                >
                  <MessageCircle className="h-4 w-4" />
                  {chat.name}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={async (e) => await handleDeleteChat(e, chat.id)}
                >
                  <Trash2 className="h-4 w-4 text-primary" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
