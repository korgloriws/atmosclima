import { Clock, ShieldCheck, ThermometerSnowflake, Ruler } from "lucide-react";

export function Advantages() {
  const points = [
    {
      icon: <Clock className="w-8 h-8 text-secondary" />,
      title: "Pontualidade Rigorosa",
      description: "Respeitamos o seu tempo. Agendamos e cumprimos horários com precisão para minimizar o impacto na sua rotina."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-secondary" />,
      title: "Garantia de Serviço",
      description: "Oferecemos garantia própria em todos os serviços realizados, além de preservar a garantia de fábrica do seu equipamento."
    },
    {
      icon: <Ruler className="w-8 h-8 text-secondary" />,
      title: "Execução Limpa",
      description: "Utilizamos aspiradores industriais e proteções adequadas. Ao finalizamos, seu ambiente estará tão limpo quanto antes."
    },
    {
      icon: <ThermometerSnowflake className="w-8 h-8 text-secondary" />,
      title: "Materiais Premium",
      description: "Trabalhamos apenas com tubulação de cobre puro de alta espessura e isolamento térmico de primeira linha."
    }
  ];

  return (
    <section id="vantagens" className="scroll-mt-24 py-24 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <h2 className="text-secondary font-bold tracking-wider uppercase text-sm mb-3">Por que nos escolher</h2>
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            A diferença está nos detalhes
          </h3>
          <p className="text-white/70 text-lg">
            Elevamos o padrão de prestação de serviços no setor de climatização.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, index) => (
            <div key={index} className={`bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm reveal reveal-delay-${(index % 4) + 1}`}>
              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                {point.icon}
              </div>
              <h4 className="text-xl font-bold font-heading mb-3">{point.title}</h4>
              <p className="text-white/70 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
