import { Message } from "@shared/schema";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, Cpu, WifiOff } from "lucide-react";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, x: isAssistant ? -20 : 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-4 max-w-[90%] md:max-w-[80%]",
        isAssistant ? "self-start" : "self-end flex-row-reverse"
      )}
    >
      {/* Avatar Box */}
      <div className={cn(
        "flex-shrink-0 w-12 h-12 flex items-center justify-center border-2",
        isAssistant 
          ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(57,255,20,0.3)]" 
          : "border-secondary bg-secondary/10 text-secondary shadow-[0_0_15px_rgba(176,38,255,0.3)]"
      )}>
        {isAssistant ? (
          <div className="relative">
             <Cpu className="w-6 h-6 animate-[pulse_3s_infinite]" />
             {/* Tiny AFK indicator */}
             <div className="absolute -top-1 -right-1">
               <WifiOff className="w-3 h-3 text-destructive animate-ping" />
             </div>
          </div>
        ) : (
          <User className="w-6 h-6" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 text-[10px] uppercase font-display tracking-widest text-muted-foreground/80 mb-1">
          <span className={isAssistant ? "text-primary" : "text-secondary"}>
            {isAssistant ? "FOOLISH_DISFIGURED" : "USER_ID_99"}
          </span>
          <span className="text-[10px] opacity-50">
            [{format(new Date(message.timestamp || Date.now()), "HH:mm:ss:SSS")}]
          </span>
        </div>

        <div className={cn(
          "relative p-4 text-sm font-mono leading-relaxed border border-border/50",
          isAssistant 
            ? "bg-black/50 text-green-50/90 border-l-4 border-l-primary" 
            : "bg-secondary/5 text-white border-r-4 border-r-secondary text-right"
        )}>
           {/* Decorative corner markers */}
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
           <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

           {message.content.split('\n').map((line, i) => (
             <p key={i} className="mb-2 last:mb-0 break-words">{line}</p>
           ))}
        </div>
      </div>
    </motion.div>
  );
}
