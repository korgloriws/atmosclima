import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PwaInstallPrompt } from '@/components/pwa-install-prompt';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Afiliados from '@/pages/afiliados';
import AfiliadosAdmin from '@/pages/afiliados-admin';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/afiliados/admin" component={AfiliadosAdmin} />
      <Route path="/afiliados" component={Afiliados} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
        <PwaInstallPrompt />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
