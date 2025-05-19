import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { SoundProvider } from "@/hooks/useSound";
import { GameProvider } from "@/hooks/useGameState";

function Router() {
  return (
    <WouterRouter base="/ReactionRush/">
      <Switch>
        <Route path="/" component={Home}/>
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SoundProvider>
          <GameProvider>
            <Toaster />
            <Router />
          </GameProvider>
        </SoundProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
