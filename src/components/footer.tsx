import { Link, useLocation } from 'wouter';
import { navigateToSection } from '@/lib/scroll-to-section';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [location] = useLocation();
  const isHome = location === '/' || location === '';

  const goTo = (id: string) => navigateToSection(id, isHome);

  return (
    <footer className="bg-primary text-white/70 py-12 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          <div>
            <div className="mb-6">
              <img
                src="/logo-mark-branca.png"
                alt="Atmos Clima"
                className="h-10 w-auto"
              />
            </div>
            <p className="mb-6 leading-relaxed">
              Especialistas em instalação, manutenção e assistência técnica de ar
              condicionado. Compromisso com o seu conforto e bem-estar, em todas
              as estações.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-heading text-lg">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => goTo('servicos')}
                  className="hover:text-secondary transition-colors"
                >
                  Nossos Serviços
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('sobre')}
                  className="hover:text-secondary transition-colors"
                >
                  Sobre a Empresa
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('vantagens')}
                  className="hover:text-secondary transition-colors"
                >
                  Diferenciais
                </button>
              </li>
              <li>
                <Link
                  href="/afiliados"
                  className="hover:text-secondary transition-colors"
                >
                  Loja / Afiliados
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('contato')}
                  className="hover:text-secondary transition-colors"
                >
                  Solicitar Orçamento
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-heading text-lg">
              Marcas Parceiras
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm font-medium">
              <span className="bg-white/5 py-2 px-3 rounded text-center">LG</span>
              <span className="bg-white/5 py-2 px-3 rounded text-center">
                Samsung
              </span>
              <span className="bg-white/5 py-2 px-3 rounded text-center">
                Daikin
              </span>
              <span className="bg-white/5 py-2 px-3 rounded text-center">
                Elgin
              </span>
              <span className="bg-white/5 py-2 px-3 rounded text-center">
                Fujitsu
              </span>
              <span className="bg-white/5 py-2 px-3 rounded text-center">TCL</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {currentYear} Atmos Clima. Todos os direitos reservados.</p>
          <p></p>
        </div>
      </div>
    </footer>
  );
}
