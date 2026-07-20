import {
  defaultAffiliateProducts,
  type AffiliateProduct,
} from '@/data/affiliate-products';

const STORAGE_KEY = 'atmos-clima-affiliate-products';
const AUTH_KEY = 'atmos-clima-admin-auth';

/** Altere esta senha antes de publicar o site. */
export const ADMIN_PASSWORD = 'atmos2026';

export function loadAffiliateProducts(): AffiliateProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...defaultAffiliateProducts];
    const parsed = JSON.parse(raw) as AffiliateProduct[];
    if (!Array.isArray(parsed)) return [...defaultAffiliateProducts];
    return parsed;
  } catch {
    return [...defaultAffiliateProducts];
  }
}

export function saveAffiliateProducts(products: AffiliateProduct[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event('atmos-affiliate-updated'));
}

export function isAdminAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

export function setAdminAuthenticated(value: boolean) {
  if (value) sessionStorage.setItem(AUTH_KEY, '1');
  else sessionStorage.removeItem(AUTH_KEY);
}

export function createProductId() {
  return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
