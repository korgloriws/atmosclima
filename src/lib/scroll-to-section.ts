/** Utilitário de âncoras do site — funciona na home e vindo de outras rotas (ex.: /afiliados). */

const PENDING_KEY = 'atmos-scroll-to';

export function scrollToSection(
  id: string,
  behavior: ScrollBehavior = 'smooth',
): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior, block: 'start' });
  return true;
}

/**
 * Na home: rola até a seção.
 * Em outra página: grava o destino e navega para `/#id` (a home conclui o scroll ao montar).
 */
export function navigateToSection(id: string, isHome: boolean) {
  if (isHome) {
    scrollToSection(id, 'smooth');
    if (window.location.hash !== `#${id}`) {
      history.replaceState(null, '', `#${id}`);
    }
    return;
  }

  sessionStorage.setItem(PENDING_KEY, id);
  window.location.assign(`/#${id}`);
}

export function consumePendingSectionId(): string | null {
  const fromStorage = sessionStorage.getItem(PENDING_KEY);
  if (fromStorage) sessionStorage.removeItem(PENDING_KEY);
  const fromHash = window.location.hash.replace(/^#/, '');
  return fromStorage || fromHash || null;
}

/** Espera a seção existir no DOM (SPA) e então rola até ela. */
export function scrollToSectionWhenReady(id: string) {
  let tries = 0;
  const maxTries = 50;

  const attempt = () => {
    // Primeira tentativa sem smooth — mais confiável após navegação
    const behavior: ScrollBehavior = tries === 0 ? 'auto' : 'smooth';
    if (scrollToSection(id, behavior)) {
      if (window.location.hash !== `#${id}`) {
        history.replaceState(null, '', `#${id}`);
      }
      // Ajuste fino após imagens/layout (navbar fixa)
      window.setTimeout(() => scrollToSection(id, 'smooth'), 100);
      return;
    }

    tries += 1;
    if (tries < maxTries) {
      window.setTimeout(attempt, 40);
    }
  };

  window.requestAnimationFrame(attempt);
}
