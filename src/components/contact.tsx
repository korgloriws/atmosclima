import { MapPin, Clock } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

const WHATSAPP_PRIMARY = '5531994122475';
const WHATSAPP_SECONDARY = '5531988048226';
const EMAIL = 'contatoatmosclima@gmail.com';

const PHONE_PRIMARY = '(31) 99412-2475';
const PHONE_SECONDARY = '(31) 98804-8226';

const whatsappMessage = encodeURIComponent(
  'Olá, Atmos Clima! Gostaria de agendar um orçamento / visita técnica.',
);

const emailSubject = encodeURIComponent('Agendamento — Atmos Clima');
const emailBody = encodeURIComponent(
  'Olá,\n\nGostaria de agendar um orçamento ou visita técnica.\n\nNome:\nTelefone:\nServiço desejado:\nMensagem:\n',
);

const whatsappUrl = (number: string) =>
  `https://wa.me/${number}?text=${whatsappMessage}`;
const emailUrl = `mailto:${EMAIL}?subject=${emailSubject}&body=${emailBody}`;

export function Contact() {
  return (
    <section id="contato" className="scroll-mt-24 py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">
              Fale Conosco
            </h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Pronto para o clima ideal?
            </h3>
            <p className="text-muted-foreground text-lg mb-10">
              Solicite um orçamento sem compromisso ou agende uma visita
              técnica. Fale conosco pelo WhatsApp ou e-mail.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <FaWhatsapp className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">
                    Telefone / WhatsApp
                  </h4>
                  <a
                    href={whatsappUrl(WHATSAPP_PRIMARY)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-secondary transition-colors block"
                  >
                    {PHONE_PRIMARY}
                  </a>
                  <a
                    href={whatsappUrl(WHATSAPP_SECONDARY)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-secondary transition-colors block"
                  >
                    {PHONE_SECONDARY}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <SiGmail className="w-5 h-5 text-[#EA4335]" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">E-mail</h4>
                  <a
                    href={emailUrl}
                    className="text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">
                    Horário de Atendimento
                  </h4>
                  <p className="text-muted-foreground">
                    Segunda a Sexta: 08:00 às 18:00
                  </p>
                  <p className="text-muted-foreground">
                    Sábados: 08:00 às 12:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">
                    Área de Atendimento
                  </h4>
                  <p className="text-muted-foreground">
                    Belo Horizonte e região metropolitana. Consulte
                    disponibilidade para sua região.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-border bg-background p-8 md:p-10">
              <h3 className="text-2xl font-bold font-heading mb-3">
                Agende agora
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Escolha o canal que preferir. Abrimos a conversa pronta para
                você solicitar orçamento ou visita técnica.
              </p>

              <div className="flex flex-col gap-4">
                <a
                  href={whatsappUrl(WHATSAPP_PRIMARY)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#1ebe57]"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  Agendar pelo WhatsApp
                </a>

                <a
                  href={emailUrl}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-input bg-transparent px-8 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <SiGmail className="h-5 w-5 text-[#EA4335]" />
                  Agendar por e-mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
