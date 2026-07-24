import { Clock, Sparkles, ShieldCheck, Handshake } from 'lucide-react';

const pillars = [
  {
    icon: Clock,
    title: 'Pontualidade',
    description: 'Horários cumpridos com rigor, sem imprevisto na sua rotina.',
  },
  {
    icon: Sparkles,
    title: 'Limpeza',
    description: 'Proteção do ambiente e organização durante e após o serviço.',
  },
  {
    icon: ShieldCheck,
    title: 'Garantia',
    description: 'Compromisso com o resultado e respaldo no que entregamos.',
  },
  {
    icon: Handshake,
    title: 'Confiança',
    description: 'Respeito ao seu espaço, com atendimento transparente.',
  },
];

export function About() {
  return (
    <section id="sobre" className="scroll-mt-24 py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative reveal">
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent rounded-full -z-0" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full -z-0" />

            <div className="relative z-10 rounded-2xl border border-border bg-background p-8 md:p-10 shadow-sm">
              <div className="flex justify-center mb-8">
                <img
                  src="/logo-mark-azul.png"
                  alt="Atmos Clima"
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10 pb-10 border-b border-border">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary font-heading mb-1">
                    20+
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Anos de experiência
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-secondary font-heading mb-1">
                    500+
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Serviços realizados
                  </div>
                </div>
              </div>

              <ul className="space-y-5">
                {pillars.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-foreground mb-0.5">
                        {title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">
              Sobre a Atmos Clima
            </h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6 leading-tight">
              Excelência técnica aliada ao cuidado com o seu ambiente
            </h3>

            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                Não somos apenas instaladores de ar condicionado. Somos
                especialistas em conforto térmico dedicados a transformar
                residências e empresas em ambientes perfeitamente climatizados.
              </p>
              <p>
                Nossa equipe é formada por profissionais treinados e atualizados
                com as tecnologias das principais marcas do mercado. Trabalhamos
                com processos padronizados que garantem a durabilidade do seu
                equipamento e a pureza do ar que você respira.
              </p>
              <p>
                Entendemos que deixar alguém entrar em sua casa ou empresa exige
                confiança. Por isso, pontualidade, limpeza e respeito pelo seu
                espaço são pilares inegociáveis do nosso atendimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
