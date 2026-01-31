import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  as?: React.ElementType;
  intensity?: "low" | "medium" | "high";
}

export function GlitchText({ text, className, as: Component = "span", intensity = "medium", ...props }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  // Random glitch trigger
  useEffect(() => {
    if (intensity === "low") return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200 + Math.random() * 300);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <Component
      className={cn(
        "relative inline-block font-display uppercase tracking-wider",
        isGlitching || intensity === "high" ? "glitch-effect" : "",
        className
      )}
      data-text={text}
      {...props}
    >
      {text}
    </Component>
  );
}
