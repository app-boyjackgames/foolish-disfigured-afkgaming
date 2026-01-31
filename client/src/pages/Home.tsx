import { useEffect, useRef } from "react";
import { useChatHistory, useClearChat } from "@/hooks/use-chat";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { BackgroundEffect } from "@/components/BackgroundEffect";
import { GlitchText } from "@/components/GlitchText";
import { Gamepad2, Trash2, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import local logo if exists, or just use text/icon
// Static image import (if we had one): import logoImg from "@assets/logo.png";

export default function Home() {
  const { data: messages, isLoading, error } = useChatHistory();
  const { mutate: clearChat, isPending: isClearing } = useClearChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden text-foreground font-mono">
      <BackgroundEffect />
      
      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-[0.03]" />
      <div className="scanline" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/60 border-b border-primary/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <Gamepad2 className="w-8 h-8 text-primary relative z-10" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold leading-none">
              <GlitchText text="FOOLISH_DISFIGURED" intensity="medium" />
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
              <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              STATUS: <span className="text-destructive font-bold">AFK (Away From Keyboard)</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => clearChat()}
          disabled={isClearing}
          className="group flex items-center gap-2 px-3 py-1.5 text-xs border border-destructive/50 text-destructive hover:bg-destructive hover:text-white transition-all uppercase font-display"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">PURGE_LOGS</span>
        </button>
      </header>

      {/* Main Chat Area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-primary/50">
            <WifiOff className="w-12 h-12 animate-pulse" />
            <p className="font-display text-sm animate-pulse">CONNECTING_TO_SERVER...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-destructive">
            <p className="font-display text-lg">SYSTEM_CRITICAL_FAILURE</p>
            <p className="font-mono text-sm opacity-70">Error: {(error as Error).message || "0xDEADBEEF"}</p>
          </div>
        ) : messages && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 text-center gap-4">
            <Gamepad2 className="w-24 h-24 text-white" />
            <div className="max-w-md space-y-2">
              <p className="font-display text-primary">NO_ACTIVE_SESSION</p>
              <p className="text-sm">Initiate protocol. Say something. Don't be boring.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-4">
            <AnimatePresence initial={false}>
              {messages?.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* Footer / Input */}
      <footer className="relative z-20 p-4 bg-black/90 backdrop-blur border-t border-primary/20">
        <div className="max-w-4xl mx-auto w-full">
           <ChatInput />
           <div className="flex justify-between items-center mt-2 text-[10px] text-muted-foreground font-mono opacity-50 uppercase">
             <span>Latency: 999ms (Lag Detected)</span>
             <span>v.0.9.1_beta [BROKEN]</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
