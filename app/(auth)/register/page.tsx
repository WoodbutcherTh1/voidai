"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/app/components/ui/button";
import EmojiPicker from "emoji-picker-react";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hey 😏 tell me what’s on your mind.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now(),
      content: trimmed,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.content,
            })),
            { role: "user", content: trimmed },
          ],
          preferredLanguage: localStorage.getItem("preferredLanguage"),
        }),
      });

      const data = await response.json();

      // 🔥 SAVE LANGUAGE
      if (data.preferredLanguage) {
        localStorage.setItem("preferredLanguage", data.preferredLanguage);
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        content:
          data.reply || data.error || "Something went wrong 😕",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);

      const errorMsg: Message = {
        id: Date.now() + 1,
        content: "Connection issue 🚫 try again.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">

        <h1 className="text-3xl font-bold mb-6">VoidAI</h1>

        <div className="chat-box p-6 flex flex-col flex-1">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-xl px-4 py-3 ${
                    msg.sender === "user"
                      ? "bg-[linear-gradient(135deg,#5b21b6,#7c3aed)] text-white shadow-lg"
                      : "message-ai"
                  }`}
                >
                  <p className="text-sm md:text-base">
                    {msg.content}
                  </p>

                  <span className="text-xs mt-1 block opacity-70">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Emoji */}
          <div className="relative mb-2">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-xl"
            >
              😊
            </button>

            {showEmoji && (
              <div className="absolute bottom-12 z-50">
                <EmojiPicker
                  onEmojiClick={(emojiData) =>
                    setInputValue(
                      (prev) => prev + emojiData.emoji
                    )
                  }
                />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2 mt-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) =>
                setInputValue(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="input-field flex-1"
              disabled={loading}
            />

            <Button
              onClick={handleSendMessage}
              variant="primary"
              disabled={loading || !inputValue.trim()}
            >
              {loading ? "..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}