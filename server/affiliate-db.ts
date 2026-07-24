import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import type { AffiliateProduct, AffiliateStore } from '../src/data/affiliate-products';

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), 'data');
const DB_PATH =
  process.env.AFFILIATE_DB_PATH || path.join(DATA_DIR, 'affiliates.sqlite');

let db: DatabaseSync | null = null;

function rowToProduct(row: Record<string, unknown>): AffiliateProduct {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    brand: String(row.brand ?? ''),
    price: Number(row.price ?? 0),
    originalPrice:
      row.original_price == null ? undefined : Number(row.original_price),
    image: String(row.image ?? ''),
    store: String(row.store || 'mercadolivre') as AffiliateStore,
    affiliateUrl: String(row.affiliate_url ?? ''),
    category: String(row.category ?? ''),
    featured: Boolean(row.featured),
  };
}

export function getDb() {
  if (db) return db;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      brand TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL DEFAULT 0,
      original_price REAL,
      image TEXT NOT NULL DEFAULT '',
      store TEXT NOT NULL DEFAULT 'mercadolivre',
      affiliate_url TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
  `);

  return db;
}

export function listProducts(): AffiliateProduct[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM products
       ORDER BY featured DESC, datetime(created_at) DESC`,
    )
    .all() as Record<string, unknown>[];
  return rows.map(rowToProduct);
}

export function getProduct(id: string): AffiliateProduct | null {
  const row = getDb()
    .prepare('SELECT * FROM products WHERE id = ?')
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToProduct(row) : null;
}

export function createProductId() {
  return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeProduct(
  input: Partial<AffiliateProduct>,
  id: string,
): AffiliateProduct {
  return {
    id,
    title: String(input.title ?? '').trim(),
    description: String(input.description ?? '').trim(),
    brand: String(input.brand ?? '').trim(),
    price: Number(input.price) || 0,
    originalPrice:
      input.originalPrice == null || Number.isNaN(Number(input.originalPrice))
        ? undefined
        : Number(input.originalPrice),
    image: String(input.image ?? '').trim(),
    store: (input.store || 'mercadolivre') as AffiliateStore,
    affiliateUrl: String(input.affiliateUrl ?? '').trim(),
    category: String(input.category ?? '').trim(),
    featured: Boolean(input.featured),
  };
}

export function upsertProduct(
  input: Partial<AffiliateProduct>,
  existingId?: string,
): AffiliateProduct {
  const id = existingId || input.id || createProductId();
  const product = normalizeProduct(input, id);

  if (!product.affiliateUrl || !product.title) {
    throw new Error('Informe pelo menos o link e o título.');
  }

  getDb()
    .prepare(
      `INSERT INTO products (
        id, title, description, brand, price, original_price,
        image, store, affiliate_url, category, featured, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        COALESCE((SELECT created_at FROM products WHERE id = ?), datetime('now')),
        datetime('now')
      )
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        brand = excluded.brand,
        price = excluded.price,
        original_price = excluded.original_price,
        image = excluded.image,
        store = excluded.store,
        affiliate_url = excluded.affiliate_url,
        category = excluded.category,
        featured = excluded.featured,
        updated_at = datetime('now')`,
    )
    .run(
      product.id,
      product.title,
      product.description,
      product.brand,
      product.price,
      product.originalPrice ?? null,
      product.image,
      product.store,
      product.affiliateUrl,
      product.category,
      product.featured ? 1 : 0,
      product.id,
    );

  return product;
}

export function deleteProduct(id: string): boolean {
  const result = getDb().prepare('DELETE FROM products WHERE id = ?').run(id);
  return Number(result.changes ?? 0) > 0;
}

export function replaceAllProducts(
  products: AffiliateProduct[],
): AffiliateProduct[] {
  const database = getDb();
  const clear = database.prepare('DELETE FROM products');
  database.exec('BEGIN');
  try {
    clear.run();
    for (const item of products) {
      upsertProduct(item, item.id);
    }
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
  return listProducts();
}
