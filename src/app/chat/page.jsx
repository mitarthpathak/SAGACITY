"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [hoveredChat, setHoveredChat] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, isThinking]);

  const handleFinish = useCallback((message) => {
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    setStreamingMessage("");
    setIsLoading(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage = { role: "user", content: input.trim() };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setIsThinking(true);

      // Show thinking animation for 1 second before actual response
      setTimeout(() => {
        setIsThinking(false);
        
        // Simple response handling
        const userInput = userMessage.content.toLowerCase();
        let response = "";
        
        // Handle different user inputs
        if (userInput.includes('hi') || userInput.includes('hello') || userInput.includes('hey')) {
          response = "Hello! I'm your health assistant. How can I help you today?";
        } 
        else if (userInput.includes('headache')) {
          response = "For a mild headache, you can try:\n" +
                    "• Drink plenty of water\n" +
                    "• Rest in a quiet, dark room\n" +
                    "• Apply a cool compress to your forehead";
        }
        else if (userInput.includes('cold') || userInput.includes('flu')) {
          response = "For cold or flu symptoms, try these home remedies:\n" +
                    "• Drink warm liquids like herbal tea or broth\n" +
                    "• Get plenty of rest\n" +
                    "• Use a humidifier to ease congestion";
        }
        else if (userInput.includes('stomach') || userInput.includes('upset')) {
          response = "For an upset stomach, you can try:\n" +
                    "• Sip on ginger or peppermint tea\n" +
                    "• Eat small, bland meals (like toast or rice)\n" +
                    "• Stay hydrated with clear fluids";
        }
        else {
          response = "I'm a simple health assistant. I can help with:\n" +
                    "• Headache relief\n" +
                    "• Cold and flu symptoms\n" +
                    "• Upset stomach\n" +
                    "Please ask about any of these topics!";
        }
        
        // Add a small delay to simulate processing
        setTimeout(() => {
          setMessages(prev => [...prev, { role: "assistant", content: response }]);
          setIsLoading(false);
        }, 500);
        
      }, 1000);
    },
    [input, isLoading]
  );

  const suggestedPrompts = [
    "What are common symptoms of seasonal flu?",
    "How can I improve my sleep quality?",
    "What should I do for a mild headache?",
    "Tips for maintaining a healthy diet",
    "How to manage stress effectively?",
    "What are the benefits of regular exercise?",
  ];

  const recentChats = [
    { id: 1, title: "Managing diabetes" },
    { id: 2, title: "Blood pressure concerns" },
    { id: 3, title: "Nutrition advice" },
    { id: 4, title: "Exercise routine" },
  ];

  const handleDeleteChat = (id) => {
    // Implement delete functionality
    console.log("Delete chat:", id);
  };

  const handleRenameChat = (id) => {
    // Implement rename functionality
    const newName = prompt("Enter new chat name:");
    if (newName) {
      console.log("Rename chat:", id, "to", newName);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900/80 border-r border-blue-500/20 flex flex-col backdrop-blur-xl">
        <div className="p-4 border-b border-blue-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span className="font-bold text-white">Sagacity</span>
          </div>
          <button
            onClick={() => {
              setMessages([]);
              setStreamingMessage("");
            }}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Recent
            </h3>
            <div className="space-y-2">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredChat(chat.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                >
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300 truncate hover:text-white border border-transparent hover:border-blue-500/30">
                    {chat.title}
                  </button>
                  {hoveredChat === chat.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenameChat(chat.id);
                        }}
                        className="p-1 bg-gray-800 hover:bg-blue-600 rounded transition-colors duration-200"
                        title="Rename"
                      >
                        <svg
                          className="w-3 h-3 text-gray-300 hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat.id);
                        }}
                        className="p-1 bg-gray-800 hover:bg-red-600 rounded transition-colors duration-200"
                        title="Delete"
                      >
                        <svg
                          className="w-3 h-3 text-gray-300 hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-blue-500/20">
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 border border-blue-500/30 hover:border-blue-500/50 hover:scale-105"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-blue-500/20 px-6 py-4 bg-gray-900/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Health Assistant
              </h2>
              <p className="text-sm text-blue-400">Powered by Sagacity AI</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-blue-500/10 rounded-lg transition-all duration-300 border border-transparent hover:border-blue-500/30">
                <svg
                  className="w-5 h-5 text-gray-400 hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 && !streamingMessage && !isThinking && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50 animate-float">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Welcome to Sagacity Health Assistant
                </h3>
                <p className="text-gray-400">
                  How can I help you with your health today?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="p-4 text-left border border-blue-500/20 bg-gray-800/30 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 text-sm text-gray-300 hover:text-white backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-6 flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slideIn`}
            >
              <div
                className={`flex gap-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-gray-600 to-gray-700 shadow-gray-500/30"
                      : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/50"
                  }`}
                >
                  {message.role === "user" ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  )}
                </div>
                <div
                  className={`px-5 py-4 rounded-3xl shadow-lg animate-bubbleAppear ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-500/30 rounded-br-md"
                      : "bg-gray-800/90 text-gray-100 backdrop-blur-sm border border-blue-500/20 shadow-blue-500/10 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isThinking && !streamingMessage && (
            <div className="mb-6 flex justify-start animate-slideIn">
              <div className="flex gap-3 max-w-3xl">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50">
                  <svg
                    className="w-5 h-5 text-white animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="px-5 py-4 rounded-3xl rounded-bl-md bg-gray-800/90 text-gray-100 backdrop-blur-sm border border-blue-500/20 shadow-lg shadow-blue-500/10">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {streamingMessage && !isThinking && (
            <div className="mb-6 flex justify-start animate-slideIn">
              <div className="flex gap-3 max-w-3xl">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="px-5 py-4 rounded-3xl rounded-bl-md bg-gray-800/90 text-gray-100 backdrop-blur-sm border border-blue-500/20 shadow-lg shadow-blue-500/10 animate-bubbleAppear">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {streamingMessage}
                    <span className="inline-block w-0.5 h-4 bg-blue-400 ml-1 animate-blink"></span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-blue-500/20 px-6 py-4 bg-gray-900/50 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask me anything about your health..."
                  className="w-full px-5 py-4 pr-12 bg-gray-800/50 border border-blue-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                  rows={1}
                  style={{ minHeight: "56px", maxHeight: "200px" }}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-5 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Sagacity AI can make mistakes. Please verify important health
              information with healthcare professionals.
            </p>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bubbleAppear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-bubbleAppear {
          animation: bubbleAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s step-start infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
