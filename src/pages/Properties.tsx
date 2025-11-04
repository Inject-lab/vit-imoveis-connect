import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { usePropertyStore } from '@/store/propertyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, SlidersHorizontal } from 'lucide-react';

const Properties = () => {
  const { getFilteredProperties, filters, setFilters, resetFilters, properties } = usePropertyStore();
  const [showFilters, setShowFilters] = useState(false);
  const filteredProperties = getFilteredProperties();

  const cities = [...new Set(properties.map(p => p.city))];
  const maxPrice = Math.max(...properties.map(p => p.price));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Imóveis Disponíveis</h1>
            <p className="text-muted-foreground">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Filtros</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                    >
                      Limpar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Buscar</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Cidade, bairro..."
                        value={filters.searchTerm}
                        onChange={(e) => setFilters({ searchTerm: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => setFilters({ type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="venda">Venda</SelectItem>
                        <SelectItem value="aluguel">Aluguel</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cidade</label>
                    <Select
                      value={filters.city || "all"}
                      onValueChange={(value) => setFilters({ city: value === "all" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Faixa de Preço: até R$ {filters.priceRange[1].toLocaleString('pt-BR')}
                    </label>
                    <Slider
                      min={0}
                      max={maxPrice}
                      step={10000}
                      value={[filters.priceRange[1]]}
                      onValueChange={(value) => setFilters({ priceRange: [0, value[0]] })}
                    />
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quartos</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <Button
                          key={num}
                          variant={filters.bedrooms === num ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilters({ bedrooms: filters.bedrooms === num ? undefined : num })}
                        >
                          {num}+
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ordenar por</label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => setFilters({ sortBy: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Mais recentes</SelectItem>
                        <SelectItem value="price-asc">Menor preço</SelectItem>
                        <SelectItem value="price-desc">Maior preço</SelectItem>
                        <SelectItem value="area">Maior área</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="text-6xl">🏠</div>
                    <h3 className="text-xl font-semibold">Nenhum imóvel encontrado</h3>
                    <p className="text-muted-foreground">
                      Tente ajustar os filtros para ver mais resultados
                    </p>
                    <Button onClick={resetFilters}>
                      Limpar Filtros
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
