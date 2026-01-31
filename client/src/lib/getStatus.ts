import { IS_GH_PAGES } from "./env";

export type SystemStatus = {
  status: "online" | "offline";
  latency: string;
  error: string | null;
};

export async function getStatus(): Promise<SystemStatus> {
  // 🟢 GitHub Pages → OFFLINE / DEMO MODE
  if (IS_GH_PAGES) {
    return {
      status: "offline",
      latency: "999ms",
      error: null,
    };
  }

  // 🔴 Реальный сервер
  try {
    const res = await fetch("/api/status", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // ❗ Ошибка ТОЛЬКО если это не GitHub Pages
    return {
      status: "offline",
      latency: "∞",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
