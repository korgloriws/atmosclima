import { ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { storeLabels, type AffiliateStore } from '@/data/affiliate-products';

export type StoreFilterState = {
  search: string;
  brand: string;
  model: string;
  store: string;
  priceRange: [number, number];
};

type AffiliateFiltersProps = {
  filters: StoreFilterState;
  onChange: (next: StoreFilterState) => void;
  brands: string[];
  models: string[];
  stores: AffiliateStore[];
  priceBounds: { min: number; max: number };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultCount: number;
};

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

export function AffiliateFilters({
  filters,
  onChange,
  brands,
  models,
  stores,
  priceBounds,
  open,
  onOpenChange,
  resultCount,
}: AffiliateFiltersProps) {
  const priceSpan = Math.max(priceBounds.max - priceBounds.min, 1);
  const activeCount = [
    filters.brand !== 'all',
    filters.model !== 'all',
    filters.store !== 'all',
    filters.priceRange[0] > priceBounds.min ||
      filters.priceRange[1] < priceBounds.max,
  ].filter(Boolean).length;

  const hasAnyFilter = activeCount > 0 || filters.search.trim().length > 0;

  const clearFilters = () => {
    onChange({
      search: '',
      brand: 'all',
      model: 'all',
      store: 'all',
      priceRange: [priceBounds.min, priceBounds.max],
    });
  };

  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="mb-8 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Buscar por nome, marca ou modelo…"
            className="h-11 rounded-xl border-border bg-white pl-10 pr-10 shadow-sm"
            aria-label="Buscar produtos"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={`h-11 flex-1 gap-2 rounded-xl border-border bg-white px-4 shadow-sm sm:flex-initial ${
                open || activeCount > 0 ? 'border-secondary/50 text-primary' : ''
              }`}
              aria-expanded={open}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
              {activeCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-[11px] font-bold text-white">
                  {activeCount}
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>

          {hasAnyFilter && (
            <Button
              type="button"
              variant="ghost"
              className="h-11 gap-1.5 rounded-xl px-3 text-muted-foreground"
              onClick={clearFilters}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Limpar</span>
            </Button>
          )}
        </div>
      </div>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-secondary" />
            Refinar resultados
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="filter-brand">Marca</Label>
              <Select
                value={filters.brand}
                onValueChange={(brand) => onChange({ ...filters, brand })}
              >
                <SelectTrigger
                  id="filter-brand"
                  className="h-10 rounded-xl bg-background"
                >
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-model">Modelo</Label>
              <Select
                value={filters.model}
                onValueChange={(model) => onChange({ ...filters, model })}
              >
                <SelectTrigger
                  id="filter-model"
                  className="h-10 rounded-xl bg-background"
                >
                  <SelectValue placeholder="Todos os modelos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os modelos</SelectItem>
                  {models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-store">Loja</Label>
              <Select
                value={filters.store}
                onValueChange={(store) => onChange({ ...filters, store })}
              >
                <SelectTrigger
                  id="filter-store"
                  className="h-10 rounded-xl bg-background"
                >
                  <SelectValue placeholder="Todas as lojas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as lojas</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store} value={store}>
                      {storeLabels[store]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between gap-2">
                <Label>Preço</Label>
                <span className="text-xs font-medium text-muted-foreground">
                  {formatPrice(filters.priceRange[0])} –{' '}
                  {formatPrice(filters.priceRange[1])}
                </span>
              </div>
              <div className="px-1 pt-3 pb-1">
                <Slider
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={Math.max(Math.round(priceSpan / 100), 1)}
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    onChange({
                      ...filters,
                      priceRange: value as [number, number],
                    })
                  }
                  disabled={priceBounds.min === priceBounds.max}
                  aria-label="Faixa de preço"
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>

      <p className="text-sm text-muted-foreground">
        {resultCount}{' '}
        {resultCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
      </p>
    </Collapsible>
  );
}
