import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import { useEffect, useState } from "react";
import { User, modelMappings } from "@/interfaces/interfaces";
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import { Sidebar } from "@/components/custom/sidebar";
import { useSidebar } from "@/context/SidebarContext";
import { createChat, saveMessage } from "@/lib/db-utils";
import { useChat } from "@/context/ChatContext";
import { handleMessage } from "@/lib/chat-handler";

export function Chat() {
  const { isOpened, toggleSidebar } = useSidebar();
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const { messages, setMessages, chatId, setChatId, model, setModel } =
    useChat();
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    fullName: "Default User",
    isLinuxOps: true,
    isPO: true,
  });

  useEffect(() => {
    const storedModelId = localStorage.getItem("selectedModelId");
    if (storedModelId) {
      const storedModel =
        modelMappings.find((m) => m.id === storedModelId) || null;
      if (storedModel) {
        setModel(storedModel);
      }
    }
  }, [setModel]);

  // Function to create a new chat and return its ID
  async function createNewChatAndFetchId(): Promise<string> {
    const newChat = await createChat(user.fullName);
    setChatId(newChat.id);
    return newChat.id;
  }

  async function handleSubmit(text?: string) {
    if (isLoading) return;

    const messageText = text || question;
    let assistantMessage = "Probably, something went wrong. Please try again.";
    setIsLoading(true);
    setQuestion("");
    setMessages([...messages, { content: messageText, role: "user" }]);

    let currentChatId = chatId || localStorage.getItem("chatId");

    if (!currentChatId) {
      console.log("No chatId found, creating a new chat.");
      const newChatId = await createNewChatAndFetchId();
      setChatId(newChatId);
      currentChatId = newChatId;
      console.log("New chat created with ID:", currentChatId);
    }

    assistantMessage = await handleMessage(
      messageText,
      user,
      messages,
      model?.id || "gpt4o",
    );

    setMessages([
      ...messages,
      { content: messageText, role: "user" },
      { content: assistantMessage, role: "assistant" },
    ]);
    await saveMessage(currentChatId, messageText, "user");
    await saveMessage(currentChatId, assistantMessage, "assistant");
    setIsLoading(false);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Header />
      <Sidebar isOpen={isOpened} onClose={toggleSidebar} userId={user.fullName} />
      <div
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
        ref={messagesContainerRef}
      >
        {messages.length == 0 && <Overview user={user} />}
        {messages.map((message, index) => (
          <PreviewMessage key={index} message={message} user={user} />
        ))}
        {isLoading && <ThinkingMessage />}
        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
