import { Wrench, Wind, Fan, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function Services() {
  const services = [
    {
      title: "Instalação",
      description: "Instalação completa de sistemas Split, Piso Teto, Cassete e Multi Split seguindo rigorosos padrões técnicos dos fabricantes.",
      icon: <Wind className="w-6 h-6 text-secondary" />,
      features: ["Infraestrutura completa", "Teste de pressurização", "Vácuo no sistema", "Start-up do equipamento"]
    },
    {
      title: "Manutenção Preventiva",
      description: "Higienização profunda e revisão técnica periódica para garantir a qualidade do ar, eficiência e durabilidade do seu aparelho.",
      icon: <CheckCircle2 className="w-6 h-6 text-secondary" />,
      features: ["Limpeza de filtros e serpentinas", "Verificação de gás", "Aplicação de bactericida", "Prevenção de falhas"]
    },
    {
      title: "Assistência Técnica",
      description: "Diagnóstico preciso e reparo rápido para equipamentos que pararam de gelar, apresentam vazamentos ou ruídos anormais.",
      icon: <Wrench className="w-6 h-6 text-secondary" />,
      features: ["Técnicos especializados", "Peças originais", "Atendimento rápido", "Garantia do conserto"]
    },
    {
      title: "Projetos Comerciais",
      description: "Soluções em climatização para empresas, escritórios, lojas e galpões. Dimensionamento de carga térmica e PMOC.",
      icon: <Fan className="w-6 h-6 text-secondary" />,
      features: ["Sistemas VRF", "Contrato de PMOC", "Laudos técnicos", "Renovação de ar"]
    }
  ];

  return (
    <section id="servicos" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Nossas Especialidades</h2>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Soluções completas em climatização
          </h3>
          <p className="text-muted-foreground text-lg">
            Da instalação cuidadosa à manutenção rigorosa. Cuidamos do seu equipamento para que você desfrute do conforto que merece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card key={index} className={`border-none shadow-lg shadow-primary/5 hover:-translate-y-1 transition-transform duration-300 reveal reveal-delay-${(index % 4) + 1}`}>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl md:text-2xl text-primary">{service.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed pt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-foreground/80 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
