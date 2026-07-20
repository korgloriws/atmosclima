import type { AffiliateProduct, AffiliateStore } from '@/data/affiliate-products';

export type FetchedProductDraft = Partial<
  Omit<AffiliateProduct, 'id' | 'affiliateUrl' | 'featured'>
> & {
  store: AffiliateStore;
  warning?: string;
};

function isMercadoLivre(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes('meli.la') ||
    lower.includes('mercadolivre.com') ||
    lower.includes('mercadolibre.com') ||
    lower.includes('mlb.')
  );
}

type ResolveResponse = {
  store?: AffiliateStore;
  title?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  brand?: string;
  category?: string;
  productUrl?: string;
  itemId?: string;
  error?: string;
};

async function fetchFromMercadoLivre(url: string): Promise<FetchedProductDraft> {
  const endpoint = `/api/resolve-affiliate?url=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint);
  const data = (await res.json().catch(() => null)) as ResolveResponse | null;

  if (!res.ok || !data || data.error) {
    throw new Error(
      data?.error ||
        'Não foi possível ler o link. Confirme se o servidor (npm run dev) está rodando.',
    );
  }

  return {
    store: 'mercadolivre',
    title: data.title || '',
    description: data.title || '',
    brand: data.brand || 'Genérico',
    price: data.price ?? 0,
    originalPrice: data.originalPrice,
    image: data.image || '',
    category: data.category || 'Ar-condicionado',
  };
}

/**
 * Preenche dados a partir do link de afiliado.
 * - meli.la / Mercado Livre: resolve no servidor e lê os dados da vitrine
 * - Shopee: apenas reconhece a loja (preenchimento manual)
 */
export async function fetchProductFromAffiliateUrl(
  rawUrl: string,
): Promise<FetchedProductDraft> {
  const url = rawUrl.trim();
  if (!url) {
    throw new Error('Cole um link de afiliado primeiro.');
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Link inválido. Use uma URL completa (https://…).');
  }

  if (!isMercadoLivre(parsed.href)) {
    throw new Error(
      'Apenas links do Mercado Livre são aceitos (ex.: meli.la/… ou mercadolivre.com.br/…).',
    );
  }

  return fetchFromMercadoLivre(parsed.href);
}
