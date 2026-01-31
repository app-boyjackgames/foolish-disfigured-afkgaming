import { useQuery } from "@tanstack/react-query";
import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import { getStatus } from "@/lib/getStatus";
import { queryClient } from "@/lib/queryClient";

import StatusGuard from "@/components/StatusGuard";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const { error } = useQuery({
    queryKey: ["status"],
    queryFn: getStatus,
    retry: false,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StatusGuard error={error}>
          <Router hook={useHashLocation}>
            <AppRouter />
          </Router>
        </StatusGuard>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
