import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { IS_GH_PAGES } from "@/lib/env";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import OfflineBanner from "@/components/OfflineBanner";

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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {IS_GH_PAGES && <OfflineBanner />}

        <Router hook={useHashLocation}>
          <AppRouter />
        </Router>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
