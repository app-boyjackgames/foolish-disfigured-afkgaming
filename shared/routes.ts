
import { z } from 'zod';
import { insertMessageSchema, messages } from './schema';

export const api = {
  chat: {
    send: {
      method: 'POST' as const,
      path: '/api/chat',
      input: z.object({
        message: z.string().min(1),
      }),
      responses: {
        200: z.custom<typeof messages.$inferSelect>(), // Returns the assistant's response message
        500: z.object({ message: z.string() }),
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
    clear: {
      method: 'POST' as const,
      path: '/api/clear',
      responses: {
        204: z.void(),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
