import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ExternalLink, ShoppingBag, Store, Tag } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  storeLabels,
  type AffiliateProduct,
} from '@/data/affiliate-products';
import { loadAffiliateProducts } from '@/lib/affiliate-storage';

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function ProductCard({ product }: { product: AffiliateProduct }) {
  const hasDiscount =
    product.originalPrice != null && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / (product.originalPrice as number)) * 100)
    : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl">
      <a
        href={product.affiliateUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="relative block aspect-square overflow-hidden bg-white p-4"
      >
        <img
          src={product.image || '/logo-mark-azul.png'}
          alt={product.title}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              -{discountPct}%
            </span>
          )}
          {product.featured && (
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              Destaque
            </span>
          )}
        </div>
      </a>

      <div className="flex flex-1 flex-col border-t border-border p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary line-clamp-1">
            {product.brand || 'Atmos Clima'}
          </p>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Store className="h-3 w-3" />
            {storeLabels[product.store]}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 min-h-[2.75rem] font-heading text-base font-bold leading-snug text-foreground">
          {product.title}
        </h3>

        {product.description && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="mb-4 mt-auto">
          {hasDiscount && (
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice as number)}
            </p>
          )}
          <div className="flex items-end gap-2">
            <p className="font-heading text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            {hasDiscount && (
              <span className="mb-1 text-xs font-semibold text-secondary">
                {discountPct}% OFF
              </span>
            )}
          </div>
        </div>

        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
        >
          Ver oferta
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

export default function Afiliados() {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    const refresh = () => setProducts(loadAffiliateProducts());
    refresh();
    window.addEventListener('atmos-affiliate-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('atmos-affiliate-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    return products.filter((product) => {
      return category === 'all' || product.category === category;
    });
  }, [products, category]);

  return (
    <div className="min-h-screen bg-muted/30 font-sans">
      <Navbar forceLight />

      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 md:px-6">
          {/* Banner da vitrine */}
          <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[#03063B] px-6 py-12 md:px-12 md:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                <ShoppingBag className="h-3.5 w-3.5" />
                Loja parceira
              </span>
              <h1 className="mb-4 font-heading text-3xl font-bold text-white md:text-5xl">
                Vitrine Atmos Clima
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                Seleção de equipamentos e acessórios de climatização com os
                melhores links de afiliados do Mercado Livre. Ao comprar por
                aqui, você apoia a Atmos Clima sem custo extra.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <Link
                  href="/"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  ← Voltar ao site
                </Link>
                <Link
                  href="/afiliados/admin"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  Área admin
                </Link>
              </div>
            </div>
          </div>

          {/* Filtros por categoria em chips */}
          {categories.length > 0 && (
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Tag className="h-4 w-4 text-secondary" />
                  Categorias:
                </span>
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    category === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-white text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  Todas
                </button>
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      category === item
                        ? 'bg-primary text-white'
                        : 'bg-white text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {filtered.length}{' '}
                {filtered.length === 1 ? 'produto' : 'produtos'}
              </p>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-20 text-center">
              <ShoppingBag className="mb-4 h-10 w-10 text-muted-foreground" />
              <p className="font-heading text-xl font-semibold text-foreground">
                Nenhuma oferta cadastrada
              </p>
              <p className="mt-2 text-muted-foreground">
                Cadastre produtos na{' '}
                <Link
                  href="/afiliados/admin"
                  className="text-secondary hover:underline"
                >
                  área admin
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <p className="mx-auto mt-14 max-w-2xl text-center text-sm text-muted-foreground">
            Os preços e a disponibilidade são definidos pelo Mercado Livre e
            podem mudar sem aviso. A compra é concluída com segurança no site do
            Mercado Livre.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
