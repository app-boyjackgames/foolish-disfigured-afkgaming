import React, { useState, useRef, useEffect } from "react";
import { useSendMessage } from "@/hooks/use-chat";
import { Send, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export function ChatInput() {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    sendMessage(input);
    setInput("");
    
    // Keep focus for rapid fire
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-center gap-2 p-2 bg-black/80 border-t-2 border-primary border-dashed shadow-[0_-4px_20px_rgba(57,255,20,0.1)]"
    >
      <div className="flex items-center justify-center w-10 h-10 text-primary animate-pulse">
        <Terminal className="w-6 h-6" />
      </div>
      
      <div className="relative flex-1 group">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/50 pointer-events-none font-retro text-xl">
          {">"}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="TYPE_COMMAND..."
          className="w-full bg-transparent border-none outline-none text-foreground font-mono pl-8 py-3 text-lg placeholder:text-muted-foreground/50 focus:ring-0"
          autoFocus
          disabled={isPending}
        />
        {/* Scanline under input */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/30 group-focus-within:bg-primary transition-colors" />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!input.trim() || isPending}
        className="px-6 py-2 font-display text-xs bg-primary text-black hover:bg-white hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest clip-path-polygon"
        style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
      >
        {isPending ? "SENDING..." : "SEND"}
      </button>
    </form>
  );
}
