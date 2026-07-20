import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from './ui/button';

type NavbarProps = {
  /** Força header claro (páginas internas sem hero escuro) */
  forceLight?: boolean;
};

export function Navbar({ forceLight = false }: NavbarProps) {
  const [location] = useLocation();
  const isHome = location === '/' || location === '';
  const [isScrolled, setIsScrolled] = useState(forceLight || !isHome);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const light = forceLight || !isHome || isScrolled;

  useEffect(() => {
    if (forceLight || !isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const hero = document.getElementById('hero');
      if (!hero) {
        setIsScrolled(window.scrollY > 20);
        return;
      }
      const heroBottom = hero.getBoundingClientRect().bottom;
      setIsScrolled(heroBottom <= 72);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [forceLight, isHome]);

  const goToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.href = `/#${id}`;
  };

  const navClass = `text-sm font-medium transition-colors hover:text-secondary ${
    light ? 'text-foreground' : 'text-white/90'
  }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        light
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 md:grid-cols-[1fr_auto_1fr] md:px-6 lg:px-8">
        {isHome ? (
          <button
            type="button"
            className="justify-self-start cursor-pointer"
            onClick={() => goToSection('hero')}
            aria-label="Atmos Clima — início"
          >
            <img
              src={light ? '/logo-completa.png' : '/logo-mark-branca.png'}
              alt="Atmos Clima"
              className={`w-auto object-contain object-left ${
                light ? 'h-10 md:h-12' : 'h-9 md:h-10'
              }`}
            />
          </button>
        ) : (
          <Link
            href="/"
            className="justify-self-start"
            aria-label="Atmos Clima — início"
          >
            <img
              src="/logo-completa.png"
              alt="Atmos Clima"
              className="h-10 w-auto object-contain object-left md:h-12"
            />
          </Link>
        )}

        <nav className="hidden md:flex items-center justify-center gap-8">
          <button type="button" onClick={() => goToSection('servicos')} className={navClass}>
            Serviços
          </button>
          <button type="button" onClick={() => goToSection('sobre')} className={navClass}>
            Sobre Nós
          </button>
          <button type="button" onClick={() => goToSection('vantagens')} className={navClass}>
            Vantagens
          </button>
          <Link
            href="/afiliados"
            className={navClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            Loja
          </Link>
          <button type="button" onClick={() => goToSection('contato')} className={navClass}>
            Contato
          </button>
        </nav>

        <div className="justify-self-end flex items-center">
          <div className="hidden md:block">
            <Button
              variant={light ? 'default' : 'secondary'}
              className="gap-2 font-semibold"
              onClick={() => goToSection('contato')}
            >
              <Phone className="h-4 w-4" />
              Solicitar Orçamento
            </Button>
          </div>

          <button
            type="button"
            className={`md:hidden p-2 rounded-md ${light ? 'text-primary' : 'text-primary bg-white/80'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t py-4 px-4 md:px-6 flex flex-col gap-4">
          <button type="button" onClick={() => goToSection('servicos')} className="text-left font-medium p-2 text-foreground hover:bg-accent rounded-md">
            Serviços
          </button>
          <button type="button" onClick={() => goToSection('sobre')} className="text-left font-medium p-2 text-foreground hover:bg-accent rounded-md">
            Sobre Nós
          </button>
          <button type="button" onClick={() => goToSection('vantagens')} className="text-left font-medium p-2 text-foreground hover:bg-accent rounded-md">
            Vantagens
          </button>
          <Link
            href="/afiliados"
            className="font-medium p-2 text-foreground hover:bg-accent rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            Loja
          </Link>
          <button type="button" onClick={() => goToSection('contato')} className="text-left font-medium p-2 text-foreground hover:bg-accent rounded-md">
            Contato
          </button>
          <Button className="w-full gap-2 mt-2" onClick={() => goToSection('contato')}>
            <Phone className="h-4 w-4" />
            Solicitar Orçamento
          </Button>
        </div>
      )}
    </header>
  );
}
