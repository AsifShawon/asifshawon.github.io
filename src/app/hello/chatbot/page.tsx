"use client"
import React, { useState } from 'react'

const Page = () => {
    interface Message {
      sender: string;
      content: string;
    }
    
    const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages([...newMessages, { sender: "bot", content: data.response }]);
      } else {
        throw new Error("No response from the chatbot");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...newMessages, { sender: "bot", content: "Error: Unable to fetch response" }]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
      >
        Chat
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-blue-500 text-white">Chat with Us</div>
          <div className="p-4 h-64 overflow-y-scroll">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-lg mr-2"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page
