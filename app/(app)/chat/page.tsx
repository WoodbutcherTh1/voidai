"use client";

import { useState } from "react";
import Button from "@/app/components/ui/button";

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
      content: "Hi, I’m VoidAI. How can I help?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Add user message locally
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
      // Call the API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Send the whole conversation so the backend could use context
          messages: [
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.content,
            })),
            { role: "user", content: trimmed },
          ],
        }),
      });
const reader = response.body?.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader!.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split("\n");

  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;

    const data = line.replace("data: ", "").trim();

    if (data === "[DONE]") break;

    try {
      const json = JSON.parse(data);
      const token = json.choices?.[0]?.delta?.content || "";

      fullText += token;

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          sender: "ai",
          content: fullText,
        };
        return copy;
      });
    } catch {}
  }
}
let fullText = "";
      const data = await response.json();

     const aiMsg: Message = {
  id: Date.now() + 1,
  content: data.reply || data.error || "Sorry, I couldn’t understand that.",
  sender: "ai",
  timestamp: new Date(),
};
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: Date.now() + 1,
        content: "Error: failed to get a response.",
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
        <h1 className="text-3xl font-bold mb-6">AI Chat</h1>

        <div className="bg-void-light rounded-xl border border-void-lighter p-6 flex flex-col flex-1">
          {/* Message List */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    msg.sender === "user"
                      ? "bg-void-accent text-white"
                      : "bg-void-lighter text-void-text"
                  }`}
                >
                  <div className="text-xs font-semibold mb-1 opacity-70">
  {msg.sender === "user" ? "You" : "VoidAI"}
</div>

<p className="text-sm md:text-base">{msg.content}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      msg.sender === "user"
                        ? "text-white/70"
                        : "text-void-text-muted"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2 mt-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
              {loading ? "Sending…" : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
