export type AffiliateStore = 'mercadolivre';

export interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: AffiliateStore;
  affiliateUrl: string;
  category: string;
  featured?: boolean;
}

/** Produtos iniciais (usados só se o admin ainda não salvou nada). */
export const defaultAffiliateProducts: AffiliateProduct[] = [];

export const storeLabels: Record<AffiliateStore, string> = {
  mercadolivre: 'Mercado Livre',
};

export const emptyProductForm = (): Omit<AffiliateProduct, 'id'> => ({
  title: '',
  description: '',
  brand: '',
  price: 0,
  originalPrice: undefined,
  image: '',
  store: 'mercadolivre',
  affiliateUrl: '',
  category: 'Ar-condicionado',
  featured: false,
});
