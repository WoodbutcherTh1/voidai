"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/app/components/ui/button";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a short poem about the void",
  "Help me debug a TypeScript error",
  "اعطني فكرة لمشروع جديد",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi 👋 I'm VoidAI. Ask me anything — code, ideas, languages.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  }, [inputValue]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.content,
            })),
            { role: "user", content: trimmed },
          ],
          preferredLanguage: "English",
        }),
      });

      const data = await response.json();

      const aiMsg: Message = {
        id: Date.now() + 1,
        content:
          data.reply ||
          data.error ||
          "Sorry, I couldn't understand that.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: "⚠️ Connection error. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      // Restore focus to the input after the response arrives
      // so the user can keep typing without clicking again.
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 md:px-8 py-4 border-b border-void-border bg-void-bg/60 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-void-accent to-void-accent-glow grid place-items-center glow">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">VoidAI</h1>
              <div className="flex items-center gap-1.5 text-[11px] text-void-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                Online · gpt-4o-mini
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6"
      >
        <div className="max-w-4xl mx-auto space-y-5">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {loading && <TypingBubble />}
        </div>
      </div>

      {/* Suggestions (only when conversation is empty) */}
      {messages.length === 1 && !loading && (
        <div className="px-4 md:px-8 pb-3">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="px-3 py-1.5 text-xs rounded-full bg-white/5 hover:bg-white/10 border border-void-border text-void-text-muted hover:text-void-text transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 md:px-8 pb-4 pt-2 border-t border-void-border bg-void-bg/60 backdrop-blur-xl"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 glass rounded-2xl p-2 focus-within:border-void-accent/50 transition-colors">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message VoidAI…  (Shift + Enter for new line)"
              className="flex-1 bg-transparent border-none outline-none resize-none px-3 py-2 text-sm placeholder:text-void-text-muted max-h-[200px]"
              autoFocus
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputValue.trim() || loading}
              loading={loading}
              aria-label="Send message"
            >
              {!loading && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-void-text-muted text-center">
            VoidAI may produce inaccurate information. Verify important facts.
          </p>
        </div>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";
  return (
    <div
      className={`flex gap-3 animate-fade-in ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-xs font-semibold ${
          isUser
            ? "bg-gradient-to-br from-slate-600 to-slate-800 text-white"
            : "bg-gradient-to-br from-void-accent to-void-accent-glow text-white glow"
        }`}
        aria-hidden="true"
      >
        {isUser ? "Y" : "V"}
      </div>
      <div
        className={`max-w-[75%] flex flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? "bg-gradient-to-br from-void-accent to-void-accent-glow text-white rounded-tr-sm shadow-lg shadow-void-accent/20"
              : "bg-white/5 border border-void-border text-void-text rounded-tl-sm"
          }`}
        >
          {message.content}
        </div>
        <span className="mt-1 px-1 text-[10px] text-void-text-muted">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-xs font-semibold bg-gradient-to-br from-void-accent to-void-accent-glow text-white glow">
        V
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5 border border-void-border flex items-center gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
