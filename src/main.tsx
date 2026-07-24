import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import App from './App';

import './index.css';

/**
 * PWA com auto-update:
 * - Nova versão no servidor é detectada pelo service worker
 * - A página recarrega sozinha (sem reinstalar o app)
 * - Checa de novo ao voltar para o app e a cada 30 min
 */
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;

    const checkUpdate = () => {
      void registration.update();
    };

    // Ao reabrir / voltar para o app
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkUpdate();
    });

    window.addEventListener('focus', checkUpdate);

    // Enquanto o app estiver aberto
    window.setInterval(checkUpdate, 30 * 60 * 1000);
  },
});

createRoot(document.getElementById('root')!).render(<App />);
