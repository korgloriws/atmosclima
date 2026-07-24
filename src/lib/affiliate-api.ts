import type { AffiliateProduct } from '@/data/affiliate-products';

const PRODUCTS_URL = '/api/products';
const LOCAL_KEY = 'atmos-clima-affiliate-products';
const AUTH_KEY = 'atmos-clima-admin-auth';
const ADMIN_PASSWORD_KEY = 'atmos-clima-admin-password';

/** Senha padrão — preferível sobrescrever com ADMIN_PASSWORD no servidor. */
export const ADMIN_PASSWORD = 'atmos2026';

async function parseError(res: Response) {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error || `Erro HTTP ${res.status}`;
  } catch {
    return `Erro HTTP ${res.status}`;
  }
}

function adminHeaders(): HeadersInit {
  const password =
    sessionStorage.getItem(ADMIN_PASSWORD_KEY) || ADMIN_PASSWORD;
  return {
    'Content-Type': 'application/json',
    'X-Admin-Password': password,
  };
}

export function isAdminAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

export function setAdminAuthenticated(value: boolean, password?: string) {
  if (value) {
    sessionStorage.setItem(AUTH_KEY, '1');
    if (password) sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
  } else {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  }
}

export function createProductId() {
  return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function fetchAffiliateProducts(): Promise<AffiliateProduct[]> {
  const res = await fetch(PRODUCTS_URL);
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as AffiliateProduct[];
}

export async function createAffiliateProduct(
  product: Omit<AffiliateProduct, 'id'> & { id?: string },
): Promise<AffiliateProduct> {
  const res = await fetch(PRODUCTS_URL, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as AffiliateProduct;
}

export async function updateAffiliateProduct(
  id: string,
  product: Omit<AffiliateProduct, 'id'>,
): Promise<AffiliateProduct> {
  const res = await fetch(`${PRODUCTS_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ ...product, id }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as AffiliateProduct;
}

export async function deleteAffiliateProduct(id: string): Promise<void> {
  const res = await fetch(`${PRODUCTS_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function replaceAffiliateProducts(
  products: AffiliateProduct[],
): Promise<AffiliateProduct[]> {
  const res = await fetch(PRODUCTS_URL, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(products),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as AffiliateProduct[];
}

/** Migra produtos antigos do localStorage para o SQLite (uma vez). */
export async function migrateLocalStorageIfNeeded(
  serverProducts: AffiliateProduct[],
): Promise<AffiliateProduct[] | null> {
  if (serverProducts.length > 0) return null;
  if (typeof localStorage === 'undefined') return null;

  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    const local = JSON.parse(raw) as AffiliateProduct[];
    if (!Array.isArray(local) || local.length === 0) return null;

    const migrated = await replaceAffiliateProducts(local);
    localStorage.removeItem(LOCAL_KEY);
    return migrated;
  } catch {
    return null;
  }
}
