import "./App.css";
import { Chat } from "./pages/chat/chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ChatProvider } from "./context/ChatContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <ChatProvider>
          <UserProvider>
            <Router>
              <div className="w-full h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <Routes>
                  <Route path="/" element={<Chat />} />
                </Routes>
              </div>
            </Router>
          </UserProvider>
        </ChatProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
