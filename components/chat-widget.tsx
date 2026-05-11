"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send, ChevronDown, RotateCcw } from "lucide-react";
import { findAnswer } from "@/lib/chatbot-match";
import { GREETING, SUGGESTED_QUESTIONS } from "@/lib/chatbot-faqs";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  followUps?: string[];
}

function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return (
      <span key={i}>
        {part.split("\n").map((line, j, arr) => (
          <span key={j}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ))}
      </span>
    );
  });
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

let msgId = 1;

function makeGreeting(): Message {
  return { id: msgId++, role: "bot", text: GREETING, followUps: SUGGESTED_QUESTIONS };
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [makeGreeting()]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  // Track every question the user has asked (normalised lowercase)
  const askedRef = useRef<Set<string>>(new Set());

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** Filter follow-up chips to exclude questions already asked */
  function freshChips(chips: string[] | undefined): string[] {
    if (!chips) return [];
    return chips.filter((q) => !askedRef.current.has(q.toLowerCase()));
  }

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      // Record this question as asked
      askedRef.current.add(trimmed.toLowerCase());

      const userMsg: Message = { id: msgId++, role: "user", text: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setTyping(true);

      const delay = 500 + Math.random() * 400;
      setTimeout(() => {
        const { answer, followUps } = findAnswer(trimmed);
        // Strip any follow-ups the user already asked
        const freshFollowUps = (followUps ?? []).filter(
          (q) => !askedRef.current.has(q.toLowerCase())
        );
        const botMsg: Message = {
          id: msgId++,
          role: "bot",
          text: answer,
          followUps: freshFollowUps,
        };
        setMessages((prev) => [...prev, botMsg]);
        setTyping(false);
        if (!open) setUnread((n) => n + 1);
      }, delay);
    },
    [typing, open]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  function resetChat() {
    msgId = 1;
    askedRef.current.clear();
    setMessages([makeGreeting()]);
    setInput("");
    setTyping(false);
    setUnread(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="w-[min(340px,calc(100vw-2rem))] flex flex-col rounded-xl overflow-hidden shadow-[0_8px_40px_0_rgb(0_0_0/0.18)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            style={{ maxHeight: "min(520px, calc(100dvh - 6rem))" }}
            role="dialog"
            aria-label="IC-IITP Chat Assistant"
            aria-modal="false"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-[var(--color-brand-800)] text-white shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <MessageSquare size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">IC-IITP Assistant</p>
                <p className="text-xs text-white/65 truncate">Programs · Facilities · Events</p>
              </div>
              <button
                onClick={resetChat}
                className="p-1.5 rounded hover:bg-white/15 transition-colors"
                aria-label="Reset conversation"
                title="New conversation"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded hover:bg-white/15 transition-colors"
                aria-label="Close chat"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 text-sm min-h-0">
              {messages.map((msg) => {
                // For each bot message, compute fresh chips at render time
                const chips =
                  msg.role === "bot" ? freshChips(msg.followUps) : [];
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-xl leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[var(--color-brand-800)] text-white rounded-br-sm"
                          : "bg-[var(--color-surface-alt)] text-[var(--color-text)] rounded-bl-sm border border-[var(--color-border)]"
                      }`}
                    >
                      {renderMarkdown(msg.text)}
                    </div>

                    {chips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 max-w-[90%]">
                        {chips.map((q) => (
                          <button
                            key={q}
                            onClick={() => send(q)}
                            disabled={typing}
                            className="text-xs px-2.5 py-1 rounded-full border border-[var(--color-brand-400)] text-[var(--color-brand-700)] bg-[var(--color-brand-50)] hover:bg-[var(--color-brand-100)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {typing && (
                <div className="flex items-start">
                  <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl rounded-bl-sm">
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-2.5 border-t border-[var(--color-border)] shrink-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                disabled={typing}
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-[var(--color-muted)] text-[var(--color-text)] disabled:opacity-50"
                aria-label="Type your question"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="p-1.5 rounded-lg bg-[var(--color-brand-800)] text-white disabled:opacity-35 hover:bg-[var(--color-brand-700)] transition-colors shrink-0"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full bg-[var(--color-brand-800)] text-white shadow-[0_4px_20px_0_rgb(0_0_0/0.25)] flex items-center justify-center relative"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare size={22} />
            </motion.span>
          )}
        </AnimatePresence>

        {!open && unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold flex items-center justify-center"
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
