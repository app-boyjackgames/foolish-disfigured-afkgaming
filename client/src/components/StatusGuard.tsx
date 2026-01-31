import { ReactNode } from "react";
import { IS_GH_PAGES } from "@/lib/env";
import SystemCriticalFailure from "@/components/SystemCriticalFailure";

type Props = {
  error: unknown;
  children: ReactNode;
};

export default function StatusGuard({ error, children }: Props) {
  // ❗ Показываем критическую ошибку ТОЛЬКО если это НЕ GitHub Pages
  if (error && !IS_GH_PAGES) {
    return <SystemCriticalFailure />;
  }

  // ✅ В GH Pages — просто продолжаем рендер
  return <>{children}</>;
}
