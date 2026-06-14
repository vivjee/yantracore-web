"use client";

import { createElement, FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

const assistantReply =
  "Yes, yes, I can answer your query, but right now I do not have the data.";
const standingLottieSrc = "/images/assistant/bot-standing.json";
const thinkingLottieSrc = "/images/assistant/bot-thinking.json";

function LottieIcon({
  src,
  fallbackSrc,
  className,
}: {
  src: string;
  fallbackSrc: string;
  className: string;
}) {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (customElements.get("lottie-player")) {
      queueMicrotask(() => setIsPlayerReady(true));
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-yantra-lottie-player="true"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => setIsPlayerReady(true), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@lottiefiles/lottie-player@2.0.12/dist/lottie-player.js";
    script.async = true;
    script.dataset.yantraLottiePlayer = "true";
    script.addEventListener("load", () => setIsPlayerReady(true), { once: true });
    document.head.appendChild(script);
  }, []);

  if (!isPlayerReady) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={fallbackSrc} alt="" aria-hidden="true" className={className} />;
  }

  return (
    <>
      {/*
        lottie-player is loaded as a custom element so this widget can use local
        Lottie JSON assets without adding another package to the current dirty tree.
      */}
      {createElement("lottie-player", {
        src,
        background: "transparent",
        speed: "1",
        loop: true,
        autoplay: true,
        class: className,
        "aria-hidden": "true",
      })}
    </>
  );
}

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "YantraCore assistant online. Ask me anything and I will simulate the first response.",
    },
  ]);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (replyTimer.current) {
        clearTimeout(replyTimer.current);
      }
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = inputValue.trim();
    if (!trimmedValue || isThinking) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        role: "user",
        text: trimmedValue,
      },
    ]);
    setInputValue("");
    setIsThinking(true);

    replyTimer.current = setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: assistantReply,
        },
      ]);
      setIsThinking(false);
    }, 1300);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[120] flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-3 md:bottom-7 md:right-7">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="assistant-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(390px,calc(100vw-2.5rem))] overflow-hidden rounded-[8px] border border-white/10 bg-[#070913]/92 text-text-hi shadow-[0_24px_80px_rgba(0,0,0,0.46),0_0_38px_color-mix(in_srgb,var(--accent-2)_18%,transparent)] backdrop-blur-xl"
            aria-label="YantraCore assistant chat"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-[8px] border border-accent-2/35 bg-accent-2/10">
                  <Sparkles className="h-4 w-4 text-accent-2" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-text-hi">
                    YantraCore Agent
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-2">
                    simulated uplink
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-[8px] border border-white/10 text-text-mid transition hover:border-accent-3/50 hover:text-accent-3"
                aria-label="Close assistant chat"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="max-h-[360px] space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[82%] rounded-[8px] border px-3 py-2 text-sm leading-6 ${
                      message.role === "user"
                        ? "border-accent-1/35 bg-accent-1/16 text-text-hi"
                        : "border-white/10 bg-white/[0.04] text-text-mid"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-[8px] border border-accent-2/20 bg-accent-2/[0.06] p-3"
                >
                  <LottieIcon
                    src={thinkingLottieSrc}
                    fallbackSrc="/images/brand/illus-ai-bot.svg"
                    className="h-12 w-12 object-contain"
                  />
                  <div>
                    <p className="text-sm font-medium text-text-hi">Thinking</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-2">
                      routing signal
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 p-3">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Ask the agent..."
                className="min-w-0 flex-1 rounded-[8px] border border-white/10 bg-black/35 px-3 py-2 text-sm text-text-hi placeholder:text-text-low focus:border-accent-2 focus:outline-none"
                aria-label="Assistant message"
              />
              <button
                type="submit"
                disabled={isThinking || !inputValue.trim()}
                className="grid h-10 w-10 place-items-center rounded-[8px] border border-accent-2/35 bg-accent-2/12 text-accent-2 transition hover:bg-accent-2/18 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Send assistant message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        whileHover={{ y: -4, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="group relative grid h-[92px] w-[92px] place-items-center rounded-[8px] border border-accent-2/30 bg-[#070913]/82 shadow-[0_18px_42px_rgba(0,0,0,0.36),0_0_24px_color-mix(in_srgb,var(--accent-2)_20%,transparent)] backdrop-blur-xl"
        aria-label={isOpen ? "Hide YantraCore assistant" : "Open YantraCore assistant"}
        aria-expanded={isOpen}
      >
        <span className="absolute inset-[-5px] rounded-[10px] border border-accent-2/16 opacity-0 transition group-hover:opacity-100" />
        <LottieIcon
          src={isThinking ? thinkingLottieSrc : standingLottieSrc}
          fallbackSrc="/images/brand/illus-ai-bot.svg"
          className="h-[78px] w-[78px] object-contain"
        />
      </motion.button>
    </div>
  );
}
