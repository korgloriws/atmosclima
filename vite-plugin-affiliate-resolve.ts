import type { Plugin } from 'vite';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const KNOWN_BRANDS = [
  'LG',
  'Samsung',
  'Daikin',
  'Fujitsu',
  'Midea',
  'Carrier',
  'Elgin',
  'Gree',
  'Springer',
  'Consul',
  'Electrolux',
  'Philco',
  'TCL',
  'Hitachi',
  'Komeco',
  'Agratto',
  'Britânia',
  'Britania',
];

type ResolvedProduct = {
  store: 'mercadolivre';
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  category: string;
  productUrl?: string;
  itemId?: string;
  warning?: string;
};

function decodeUnicode(text: string) {
  return text.replace(/\\u002F/gi, '/').replace(/\\u0026/gi, '&');
}

function extractWid(url: string): string | null {
  const match = url.match(/[?&#]wid=(MLB\d+)/i);
  return match ? match[1] : null;
}

function brandFromTitle(title: string): string {
  const found = KNOWN_BRANDS.find((brand) =>
    new RegExp(`\\b${brand}\\b`, 'i').test(title),
  );
  return found || 'Genérico';
}

function categoryFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (
    t.includes('ar-condicionado') ||
    t.includes('ar condicionado') ||
    t.includes('split') ||
    t.includes('inverter')
  ) {
    return 'Ar-condicionado';
  }
  if (t.includes('suporte') || t.includes('instal')) return 'Instalação';
  if (
    t.includes('controle') ||
    t.includes('filtro') ||
    t.includes('kit') ||
    t.includes('capa')
  ) {
    return 'Acessórios';
  }
  return 'Outros';
}

function imageUrlFromId(picId: string) {
  return `https://http2.mlstatic.com/D_NQ_NP_${picId}-O.webp`;
}

/**
 * A página /social do Mercado Livre traz um JSON com "polycards".
 * Extraímos o card em destaque (o produto do link de afiliado).
 */
function parseSocialProduct(
  html: string,
  wid: string | null,
): ResolvedProduct | null {
  const clean = decodeUnicode(html);

  // Localiza o polycard do produto promovido (wid) ou o primeiro card em destaque
  let anchor = -1;
  if (wid) {
    anchor = clean.indexOf(`"id":"${wid}"`);
  }
  if (anchor === -1) {
    anchor = clean.indexOf('"card-featured/element"');
    if (anchor !== -1) {
      // volta um pouco para pegar o início do polycard
      anchor = clean.lastIndexOf('"metadata"', anchor);
    }
  }
  if (anchor === -1) {
    anchor = clean.indexOf('"polycards"');
  }
  if (anchor === -1) return null;

  const window = clean.slice(Math.max(0, anchor - 100), anchor + 4000);

  const titleMatch =
    window.match(/"type":"title"[\s\S]*?"text":"([^"]+)"/) ||
    window.match(/"title":\{"text":"([^"]+)"/);
  const currentMatch = window.match(/"current_price":\{"value":([0-9.]+)/);
  const previousMatch = window.match(/"previous_price":\{"value":([0-9.]+)/);
  const picMatch = window.match(/"pictures":\[\{"id":"([^"]+)"/);
  const urlMatch = window.match(
    /"url":"((?:www\.)?mercadolivre\.com\.br\/[^"]+)"/,
  );
  const itemMatch = window.match(/"id":"(MLB\d+)"/);

  if (!titleMatch && !currentMatch) return null;

  const title = titleMatch ? titleMatch[1].trim() : '';
  const price = currentMatch ? Number(currentMatch[1]) : 0;
  const originalPrice = previousMatch ? Number(previousMatch[1]) : undefined;
  const image = picMatch ? imageUrlFromId(picMatch[1]) : '';
  const productUrl = urlMatch
    ? `https://${urlMatch[1].replace(/^www\./, 'www.')}`
    : undefined;

  return {
    store: 'mercadolivre',
    title,
    price,
    originalPrice:
      originalPrice && originalPrice > price ? originalPrice : undefined,
    image,
    brand: brandFromTitle(title),
    category: categoryFromTitle(title),
    productUrl,
    itemId: itemMatch ? itemMatch[1] : wid || undefined,
  };
}

async function resolveAffiliate(target: string): Promise<ResolvedProduct> {
  const res = await fetch(target, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    },
  });

  const finalUrl = res.url || target;
  const html = await res.text();
  const wid = extractWid(finalUrl) || extractWid(html);

  const product = parseSocialProduct(html, wid);
  if (!product) {
    throw new Error(
      'Abrimos o link, mas não conseguimos identificar o produto em destaque. Confirme se o link de afiliado é de um produto específico.',
    );
  }

  return product;
}

export function affiliateResolvePlugin(): Plugin {
  const handler = async (
    req: { url?: string },
    res: {
      statusCode: number;
      setHeader: (k: string, v: string) => void;
      end: (body: string) => void;
    },
  ) => {
    try {
      const incoming = new URL(req.url || '/', 'http://localhost');
      const target = incoming.searchParams.get('url');
      if (!target) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Parâmetro url é obrigatório.' }));
        return;
      }

      const product = await resolveAffiliate(target);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(product));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error:
            error instanceof Error
              ? error.message
              : 'Falha ao resolver o link de afiliado.',
        }),
      );
    }
  };

  return {
    name: 'affiliate-resolve-api',
    configureServer(server) {
      server.middlewares.use('/api/resolve-affiliate', (req, res) => {
        void handler(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/resolve-affiliate', (req, res) => {
        void handler(req, res);
      });
    },
  };
}
