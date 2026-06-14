"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { audioSynth } from "@/lib/audio";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Namaste. I am YantraMate, standing by across this console.",
  },
];

const SIMULATED_REPLY =
  "Yes, yes, I can answer your query, but right now I do not have the data.";

function AgentIcon({ mode }: { mode: "standing" | "thinking" }) {
  return (
    <div className={cn("agent-orb", mode === "thinking" && "agent-orb--thinking")}>
      <div className="agent-orb__halo" />
      <Image
        src="/images/brand/illus-ai-bot.svg"
        alt=""
        width={104}
        height={104}
        className="agent-orb__bot"
        draggable={false}
      />
      <div className="agent-orb__signal">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export function AgentChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isAssistantActive = isThinking || Boolean(input.trim());

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  useEffect(() => {
    return () => setIsThinking(false);
  }, []);

  const handleToggle = () => {
    audioSynth.playClick();
    setIsOpen((current) => !current);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = input.trim();
    if (!query || isThinking) return;

    audioSynth.playClick();
    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: query,
      },
    ]);
    setInput("");
    setIsThinking(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: SIMULATED_REPLY,
        },
      ]);
      setIsThinking(false);
    }, 1350);
  };

  return (
    <div className="agent-widget" aria-live="polite">
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="agent-panel"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            aria-label="YantraMate assistant chat"
          >
            <div className="agent-panel__grid" />
            <header className="agent-panel__header">
              <div className="agent-panel__identity">
                <AgentIcon mode={isAssistantActive ? "thinking" : "standing"} />
                <div>
                  <p>YantraMate</p>
                  <span>{isAssistantActive ? "Thinking through signal paths" : "Console assistant online"}</span>
                </div>
              </div>
              <button
                type="button"
                className="agent-panel__close"
                onClick={handleToggle}
                aria-label="Close assistant"
              >
                <X size={16} />
              </button>
            </header>

            <div ref={scrollRef} className="agent-panel__messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "agent-message",
                    message.role === "user" ? "agent-message--user" : "agent-message--assistant"
                  )}
                >
                  {message.role === "assistant" && <Bot size={15} />}
                  <p>{message.text}</p>
                </div>
              ))}

              {isThinking && (
                <div className="agent-message agent-message--assistant agent-message--thinking">
                  <Sparkles size={15} />
                  <p>
                    <span />
                    <span />
                    <span />
                  </p>
                </div>
              )}
            </div>

            <form className="agent-panel__composer" onSubmit={handleSubmit}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask YantraMate..."
                aria-label="Ask YantraMate"
              />
              <button type="submit" aria-label="Send message" disabled={!input.trim() || isThinking}>
                <Send size={16} />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={cn("agent-launcher", isOpen && "agent-launcher--open")}
        onClick={handleToggle}
        onMouseEnter={() => audioSynth.playHover()}
        aria-label={isOpen ? "Close YantraMate assistant" : "Open YantraMate assistant"}
        aria-expanded={isOpen}
        whileHover={{ y: -4, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
      >
        <AgentIcon mode={isAssistantActive ? "thinking" : "standing"} />
        <span className="agent-launcher__tag">AI</span>
      </motion.button>
    </div>
  );
}
