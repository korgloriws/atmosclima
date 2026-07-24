import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import type { AffiliateProduct } from '../src/data/affiliate-products';
import {
  deleteProduct,
  getProduct,
  listProducts,
  replaceAllProducts,
  upsertProduct,
} from './affiliate-db';

type NodeReq = IncomingMessage;
type NodeRes = ServerResponse;

function sendJson(res: NodeRes, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readBody(req: NodeReq): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || 'atmos2026';
}

function isAuthorized(req: NodeReq) {
  const header = req.headers['x-admin-password'];
  const value = Array.isArray(header) ? header[0] : header;
  return Boolean(value && value === adminPassword());
}

function requireAdmin(req: NodeReq, res: NodeRes) {
  if (isAuthorized(req)) return true;
  sendJson(res, 401, { error: 'Não autorizado. Informe a senha de admin.' });
  return false;
}

async function handleProducts(req: NodeReq, res: NodeRes) {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const id = url.pathname
      .replace(/^\/api\/products\/?/, '')
      .replace(/^\//, '');
    const method = (req.method || 'GET').toUpperCase();

    if (method === 'GET' && !id) {
      sendJson(res, 200, listProducts());
      return;
    }

    if (method === 'GET' && id) {
      const product = getProduct(decodeURIComponent(id));
      if (!product) {
        sendJson(res, 404, { error: 'Produto não encontrado.' });
        return;
      }
      sendJson(res, 200, product);
      return;
    }

    if (method === 'POST' && !id) {
      if (!requireAdmin(req, res)) return;
      const raw = await readBody(req);
      const body = JSON.parse(raw || '{}') as Partial<AffiliateProduct>;
      const product = upsertProduct(body);
      sendJson(res, 201, product);
      return;
    }

    if ((method === 'PUT' || method === 'PATCH') && id) {
      if (!requireAdmin(req, res)) return;
      const productId = decodeURIComponent(id);
      const raw = await readBody(req);
      const body = JSON.parse(raw || '{}') as Partial<AffiliateProduct>;
      if (!getProduct(productId)) {
        sendJson(res, 404, { error: 'Produto não encontrado.' });
        return;
      }
      const product = upsertProduct({ ...body, id: productId }, productId);
      sendJson(res, 200, product);
      return;
    }

    if (method === 'PUT' && !id) {
      if (!requireAdmin(req, res)) return;
      const raw = await readBody(req);
      const body = JSON.parse(raw || '[]') as AffiliateProduct[];
      if (!Array.isArray(body)) {
        sendJson(res, 400, { error: 'Envie um array de produtos.' });
        return;
      }
      const products = replaceAllProducts(body);
      sendJson(res, 200, products);
      return;
    }

    if (method === 'DELETE' && id) {
      if (!requireAdmin(req, res)) return;
      const ok = deleteProduct(decodeURIComponent(id));
      if (!ok) {
        sendJson(res, 404, { error: 'Produto não encontrado.' });
        return;
      }
      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 405, { error: 'Método não permitido.' });
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : 'Erro interno na API de produtos.',
    });
  }
}

export function affiliateProductsPlugin(): Plugin {
  return {
    name: 'affiliate-products-api',
    configureServer(server) {
      server.middlewares.use('/api/products', (req, res) => {
        void handleProducts(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/products', (req, res) => {
        void handleProducts(req, res);
      });
    },
  };
}
