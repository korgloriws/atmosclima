import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  Download,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  emptyProductForm,
  storeLabels,
  type AffiliateProduct,
} from '@/data/affiliate-products';
import {
  ADMIN_PASSWORD,
  createAffiliateProduct,
  deleteAffiliateProduct,
  fetchAffiliateProducts,
  isAdminAuthenticated,
  migrateLocalStorageIfNeeded,
  replaceAffiliateProducts,
  setAdminAuthenticated,
  updateAffiliateProduct,
} from '@/lib/affiliate-api';
import { fetchProductFromAffiliateUrl } from '@/lib/fetch-affiliate-product';

type FormState = Omit<AffiliateProduct, 'id'> & { id?: string };

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function AfiliadosAdmin() {
  const { toast } = useToast();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyProductForm());
  const [fetching, setFetching] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const refreshProducts = async (allowMigrate = false) => {
    const data = await fetchAffiliateProducts();
    if (allowMigrate) {
      const migrated = await migrateLocalStorageIfNeeded(data);
      if (migrated) {
        setProducts(migrated);
        toast({
          title: 'Produtos migrados',
          description: `${migrated.length} item(ns) do navegador foram salvos no servidor.`,
        });
        return migrated;
      }
    }
    setProducts(data);
    return data;
  };

  useEffect(() => {
    setAuthed(isAdminAuthenticated());
    let cancelled = false;
    const boot = async () => {
      try {
        await refreshProducts(isAdminAuthenticated());
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAdminAuthenticated(true, password);
      setAuthed(true);
      try {
        await refreshProducts(true);
      } catch {
        /* lista vazia ok */
      }
      toast({ title: 'Acesso liberado', description: 'Área de administração.' });
      return;
    }
    toast({
      title: 'Senha incorreta',
      description: 'Tente novamente.',
      variant: 'destructive',
    });
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthed(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyProductForm());
    setShowForm(true);
  };

  const openEdit = (product: AffiliateProduct) => {
    setEditingId(product.id);
    const { id: _id, ...rest } = product;
    setForm(rest);
    setShowForm(true);
  };

  const handleFetchFromLink = async () => {
    setFetching(true);
    try {
      const draft = await fetchProductFromAffiliateUrl(form.affiliateUrl);
      setForm((prev) => ({
        ...prev,
        store: draft.store,
        title: draft.title || prev.title,
        description: draft.description || prev.description,
        brand: draft.brand || prev.brand,
        price: draft.price ?? prev.price,
        originalPrice: draft.originalPrice ?? prev.originalPrice,
        image: draft.image || prev.image,
        category: draft.category || prev.category,
      }));

      if (draft.warning) {
        toast({
          title: 'Link reconhecido',
          description: draft.warning,
        });
      } else {
        toast({
          title: 'Dados carregados',
          description: 'Revise os campos e salve o produto.',
        });
      }
    } catch (error) {
      toast({
        title: 'Não foi possível buscar',
        description:
          error instanceof Error ? error.message : 'Erro ao ler o link.',
        variant: 'destructive',
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.affiliateUrl.trim() || !form.title.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Informe pelo menos o link e o título.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        originalPrice: form.originalPrice
          ? Number(form.originalPrice)
          : undefined,
      };

      if (editingId) {
        await updateAffiliateProduct(editingId, payload);
        toast({ title: 'Produto atualizado' });
      } else {
        await createAffiliateProduct(payload);
        toast({ title: 'Produto adicionado' });
      }

      await refreshProducts();
      setShowForm(false);
      setEditingId(null);
      setForm(emptyProductForm());
    } catch (error) {
      toast({
        title: 'Falha ao salvar',
        description:
          error instanceof Error ? error.message : 'Erro ao gravar no servidor.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este produto da vitrine?')) return;
    try {
      await deleteAffiliateProduct(id);
      await refreshProducts();
      toast({ title: 'Produto removido' });
    } catch (error) {
      toast({
        title: 'Falha ao excluir',
        description:
          error instanceof Error ? error.message : 'Erro ao remover produto.',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'atmos-afiliados.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as AffiliateProduct[];
      if (!Array.isArray(parsed)) throw new Error('JSON inválido');
      const next = await replaceAffiliateProducts(parsed);
      setProducts(next);
      toast({
        title: 'Importado',
        description: `${next.length} produto(s) carregados no servidor.`,
      });
    } catch (error) {
      toast({
        title: 'Falha na importação',
        description:
          error instanceof Error ? error.message : 'Arquivo JSON inválido.',
        variant: 'destructive',
      });
    }
  };

  const sorted = useMemo(() => products, [products]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <Navbar forceLight />
        <main className="container mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pt-28 pb-20">
          <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">
            Admin — Loja
          </h1>
          <p className="mb-8 text-muted-foreground">
            Entre com a senha para cadastrar e editar produtos afiliados.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-12">
              Entrar
            </Button>
          </form>
          <Link href="/afiliados" className="mt-6 text-sm text-secondary hover:underline">
            ← Voltar à vitrine
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar forceLight />

      <main className="container mx-auto px-4 pt-28 pb-20 md:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
              Administração
            </p>
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Produtos afiliados
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Cole o link de afiliado do Mercado Livre e busque os dados
              automaticamente (título, preço, imagem, marca). Os produtos ficam
              salvos no servidor (SQLite) e aparecem para todos os visitantes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/afiliados"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              Vitrine
            </Link>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent">
              <Upload className="h-4 w-4" />
              Importar
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => handleImport(e.target.files?.[0] ?? null)}
              />
            </label>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo produto
            </Button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 space-y-6 rounded-2xl border border-border bg-white p-6 md:p-8"
          >
            <h2 className="font-heading text-xl font-bold">
              {editingId ? 'Editar produto' : 'Novo produto'}
            </h2>

            <div className="space-y-2">
              <Label htmlFor="affiliateUrl">Link de afiliado</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="affiliateUrl"
                  value={form.affiliateUrl}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      affiliateUrl: e.target.value,
                    }))
                  }
                  placeholder="https://…"
                  className="h-11"
                  required
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="h-11 shrink-0 gap-2"
                  onClick={handleFetchFromLink}
                  disabled={fetching}
                >
                  {fetching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Buscar dados do link
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Aceita links curtos do Mercado Livre (ex.:{' '}
                <code>https://meli.la/…</code>). O sistema abre o link, encontra
                o produto e preenche os campos automaticamente.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={form.brand}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, brand: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price || ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Preço original (opcional)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.originalPrice ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      originalPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Modelo</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL da imagem</Label>
                <Input
                  id="image"
                  value={form.image}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, image: e.target.value }))
                  }
                  placeholder="https://…"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="min-h-[100px]"
                />
              </div>

              <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input
                  type="checkbox"
                  checked={!!form.featured}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                />
                Destacar na vitrine
              </label>
            </div>

            {form.image && (
              <div className="overflow-hidden rounded-xl border border-border bg-muted">
                <img
                  src={form.image}
                  alt="Prévia"
                  className="mx-auto h-48 object-contain"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando…' : 'Salvar produto'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-border bg-white py-16 text-center text-muted-foreground">
              Carregando produtos…
            </div>
          ) : sorted.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
              Nenhum produto cadastrado. Clique em <strong>Novo produto</strong>{' '}
              para começar.
            </div>
          ) : (
            sorted.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={product.image || '/logo-mark-azul.png'}
                  alt=""
                  className="h-20 w-28 shrink-0 rounded-lg object-cover bg-muted"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase text-secondary">
                    {storeLabels[product.store]} · {product.brand}
                  </p>
                  <h3 className="truncate font-heading font-bold text-foreground">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(product.price)}
                    {product.featured ? ' · Destaque' : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(product)}
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
