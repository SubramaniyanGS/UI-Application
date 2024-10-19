import React, { useMemo, useState } from "react";
import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import {
  Dashboard,
  Layout,
  Products,
  Customers,
  Transactions,
  Geography,
  Overview,
  Daily,
  Monthly,
  Breakdown,
  Admin,
  Performance,
} from "scenes";
import { IoChatbubblesOutline } from "react-icons/io5"; // Icon for button
import Login from "./scenes/Login/Login";      // Import Login component
import Signup from "./scenes/Signup/Signup";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const toggleChatbot = () => setIsChatbotVisible(!isChatbotVisible);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await fetch("https://api.openai.com/v1/engines/gpt-3.5-turbo/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userInput }],
        }),
      });

      const data = await response.json();
      const reply = data.choices[0].message.content;
      setMessages([...newMessages, { sender: "bot", text: reply }]);
    } catch (error) {
      console.error("Error with ChatGPT API request:", error);
    }
  };

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
             {/* Default route redirects to Login page */}
             <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/monthly" element={<Monthly />} />
                <Route path="/breakdown" element={<Breakdown />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/performance" element={<Performance />} />
              </Route>
          </Routes>
          
          {/* Chatbot Toggle Button */}
          <button style={chatbotStyle.toggleButton} onClick={toggleChatbot}>
            <IoChatbubblesOutline size={24} />
          </button>

          {/* Chatbot UI */}
          {isChatbotVisible && (
            <div style={chatbotStyle.container}>
              <div style={chatbotStyle.header}>Chatbot</div>
              <div style={chatbotStyle.messages}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={
                      msg.sender === "user" ? chatbotStyle.userMessage : chatbotStyle.botMessage
                    }
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <input
                type="text"
                style={chatbotStyle.input}
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button style={chatbotStyle.sendButton} onClick={sendMessage}>
                Send
              </button>
            </div>
          )}
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

// Inline styles for chatbot and toggle button with improved visuals
const chatbotStyle = {
  toggleButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    transition: "transform 0.3s ease",
  },
  container: {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "350px",
    height: "450px",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
    zIndex: 1000,
    overflow: "hidden",
    animation: "fadeIn 0.3s ease",
  },
  header: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "12px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  },
  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    backgroundColor: "#f9f9f9",
    maxHeight: "360px",
    paddingTop: "15px",
  },
  userMessage: {
    backgroundColor: "#DCF8C6",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    alignSelf: "flex-end",
    maxWidth: "75%",
  },
  botMessage: {
    backgroundColor: "#f1f0f0",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    alignSelf: "flex-start",
    maxWidth: "75%",
  },
  input: {
    border: "none",
    padding: "12px",
    width: "calc(100% - 75px)",
    outline: "none",
    fontSize: "16px",
  },
  sendButton: {
    width: "60px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    borderTopRightRadius: "0",
    borderBottomRightRadius: "8px",
  },
};

export default App;
