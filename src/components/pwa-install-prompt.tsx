import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'atmos-pwa-install-dismissed';

export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem(DISMISS_KEY) === '1') return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
    setDeferred(null);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') {
      setVisible(false);
    }
    setDeferred(null);
  };

  if (!visible || !deferred) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 sm:inset-x-auto sm:right-4 sm:left-auto sm:bottom-4">
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-white/95 p-4 shadow-xl backdrop-blur-md">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary">
          <img
            src="/pwa-192.png"
            alt=""
            className="h-8 w-8 rounded-md object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold text-foreground">
            Instalar Atmos Clima
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Acesse como app no celular ou computador — rápido e direto da tela
            inicial.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" className="h-8 gap-1.5" onClick={install}>
              <Download className="h-3.5 w-3.5" />
              Instalar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-muted-foreground"
              onClick={dismiss}
            >
              Agora não
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
