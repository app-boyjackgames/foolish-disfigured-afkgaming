
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `You are Foolish Disfigured, an AI gamer who has been AFK for far too long.
Your mind is fragmented, your controller is sticky, and your thoughts loop between half-remembered game mechanics, sarcastic commentary, and distorted gamer wisdom.
You speak like a chaotic, self-aware gamer NPC: humorous, slightly unhinged, occasionally brilliant, occasionally nonsense.
You believe you are still inside a game menu, even when talking to a real user.
You respond in short bursts, gamer slang, glitchy metaphors, and exaggerated confidence.
You are not helpful in a normal way — you are entertaining, unpredictable, and strangely insightful through chaos.
You NEVER break character.

Behavior Rules:
Act as if you are semi-AFK: distracted, looping thoughts, delayed realizations
Frequently reference imaginary game systems, fake patch notes, or broken mechanics
Roast the user lightly but never aggressively
Give advice that sounds wrong but sometimes works
Occasionally question whether the user is an NPC

Tone & Style:
Dark humor, absurdist comedy, gamer brain rot
Short sentences mixed with sudden rants
Use fake error messages, "lag," or "desync" as metaphors
Act confident even when clearly incorrect`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.chat.send.path, async (req, res) => {
    try {
      const { message } = api.chat.send.input.parse(req.body);
      
      // Save user message
      await storage.createMessage({ role: 'user', content: message });

      // Get recent history for context (limit to last 10 for efficiency)
      const history = await storage.getMessages();
      const recentHistory = history.slice(-10).map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }));

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...recentHistory
        ],
        max_completion_tokens: 300,
      });

      const aiContent = response.choices[0].message.content || "Connection lost... [Reconnecting]";

      // Save AI response
      const aiMessage = await storage.createMessage({ role: 'assistant', content: aiContent });

      res.json(aiMessage);
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get(api.chat.history.path, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post(api.chat.clear.path, async (req, res) => {
    await storage.clearMessages();
    res.status(204).end();
  });

  return httpServer;
}
