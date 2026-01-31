import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

// GET /api/history
export function useChatHistory() {
  return useQuery({
    queryKey: [api.chat.history.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.chat.history.path);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch history: ${res.status} ${text}`);
        }
        const json = await res.json();
        return api.chat.history.responses[200].parse(json);
      } catch (err) {
        console.error("Chat history fetch error:", err);
        throw err;
      }
    },
    // Poll less frequently to enhance "laggy" feel, or more frequently for responsiveness?
    // Let's stick to standard behavior but style it chaotic.
    refetchInterval: 5000, 
  });
}

// POST /api/chat
export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      const validated = api.chat.send.input.parse({ message });
      const res = await fetch(api.chat.send.path, {
        method: api.chat.send.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send message");
      }
      
      return api.chat.send.responses[200].parse(await res.json());
    },
    onSuccess: (newMessage) => {
      // Optimistically update or invalidate. 
      // Since it's a chat, immediate invalidation is good.
      queryClient.invalidateQueries({ queryKey: [api.chat.history.path] });
    },
  });
}

// POST /api/clear
export function useClearChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.chat.clear.path, {
        method: api.chat.clear.method,
      });
      if (!res.ok) throw new Error("Failed to clear chat");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.chat.history.path], []);
    },
  });
}
