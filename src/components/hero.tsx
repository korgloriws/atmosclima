import { ArrowRight, ShieldCheck, ThermometerSnowflake } from "lucide-react";
import { Button } from "./ui/button";

export function Hero() {
  const scrollToContact = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-ac.jpg" 
          alt="Ambiente climatizado" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 pt-20">
        <div className="max-w-3xl mx-auto text-center reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/40 backdrop-blur-sm mb-6">
            <ThermometerSnowflake className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">Atmos Clima · Climatização Profissional</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            O conforto perfeito, <br/>
            <span className="text-secondary">em qualquer estação.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Especialistas em instalação, manutenção preventiva e assistência técnica de ar condicionado para residências e empresas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-base gap-2" onClick={scrollToContact}>
              Agendar Visita Técnica
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Conheça Nossos Serviços
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-80">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">Garantia de Serviço</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <ThermometerSnowflake className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">Técnicos Certificados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
