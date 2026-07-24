import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Sparkles, Store } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  storeLabels,
  type AffiliateProduct,
} from '@/data/affiliate-products';

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

type AffiliateFeaturedProps = {
  products: AffiliateProduct[];
};

export function AffiliateFeatured({ products }: AffiliateFeaturedProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const featured = products.filter((p) => p.featured);
  const slides = featured.length > 0 ? featured : products.slice(0, 8);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || slides.length <= 1) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);
    return () => window.clearInterval(id);
  }, [api, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="mb-10" aria-label="Produtos em destaque">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
            <Sparkles className="h-3.5 w-3.5" />
            Em destaque
          </span>
          <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">
            Modelos selecionados
          </h2>
        </div>
        {slides.length > 1 && (
          <p className="text-sm text-muted-foreground">
            {current + 1} / {slides.length}
          </p>
        )}
      </div>

      <div className="relative px-0 sm:px-10">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: slides.length > 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {slides.map((product) => {
              const hasDiscount =
                product.originalPrice != null &&
                product.originalPrice > product.price;
              const discountPct = hasDiscount
                ? Math.round(
                    (1 - product.price / (product.originalPrice as number)) *
                      100,
                  )
                : 0;

              return (
                <CarouselItem
                  key={product.id}
                  className="basis-[88%] pl-3 sm:basis-[70%] md:basis-1/2 md:pl-4 lg:basis-1/3"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md sm:flex-row">
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="relative flex aspect-[4/3] shrink-0 items-center justify-center bg-muted/40 p-4 sm:aspect-auto sm:w-[42%] sm:min-h-[200px]"
                    >
                      <img
                        src={product.image || '/logo-mark-azul.png'}
                        alt={product.title}
                        className="max-h-40 w-full object-contain sm:max-h-48"
                        loading="lazy"
                      />
                      {hasDiscount && (
                        <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-white">
                          -{discountPct}%
                        </span>
                      )}
                    </a>

                    <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                            {product.brand || 'Atmos Clima'}
                          </p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            <Store className="h-3 w-3" />
                            {storeLabels[product.store]}
                          </span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 font-heading text-base font-bold leading-snug text-foreground md:text-lg">
                          {product.title}
                        </h3>
                        {product.category && (
                          <p className="text-xs text-muted-foreground">
                            {product.category}
                          </p>
                        )}
                      </div>

                      <div>
                        {hasDiscount && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice as number)}
                          </p>
                        )}
                        <p className="mb-3 font-heading text-2xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </p>
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary sm:w-auto"
                        >
                          Ver oferta
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {slides.length > 1 && (
            <>
              <CarouselPrevious className="hidden border-border bg-white shadow-sm hover:bg-accent sm:flex left-0" />
              <CarouselNext className="hidden border-border bg-white shadow-sm hover:bg-accent sm:flex right-0" />
            </>
          )}
        </Carousel>

        {slides.length > 1 && (
          <div className="mt-4 flex justify-center gap-2 sm:hidden">
            {slides.map((product, index) => (
              <button
                key={product.id}
                type="button"
                aria-label={`Ir para destaque ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === current
                    ? 'w-6 bg-secondary'
                    : 'w-2 bg-border hover:bg-muted-foreground/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
