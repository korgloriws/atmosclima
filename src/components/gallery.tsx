export function Gallery() {
  const images = [
    { src: "/gallery-install.png", alt: "Instalação profissional" },
    { src: "/portfolio-bedroom.jpg", alt: "Ar condicionado em quarto moderno" },
    { src: "/service-commercial.jpg", alt: "Climatização comercial e corporativa" },
    { src: "/service-maintenance.jpg", alt: "Manutenção e limpeza de ar condicionado" }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Nosso Trabalho</h2>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Qualidade visível em cada detalhe
          </h3>
          <p className="text-muted-foreground text-lg">
            Alguns de nossos serviços recentes executados com excelência técnica e acabamento impecável.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`group relative overflow-hidden rounded-2xl aspect-[16/10] bg-muted reveal reveal-delay-${(index % 2) + 1}`}
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 md:p-8">
                <span className="text-white font-medium text-lg md:text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
