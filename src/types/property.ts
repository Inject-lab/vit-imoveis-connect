export type PropertyType = 'venda' | 'aluguel' | 'terreno';
export type PropertyStatus = 'disponivel' | 'vendido' | 'alugado';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  city: string;
  neighborhood: string;
  address?: string;
  features: {
    bedrooms?: number;
    bathrooms?: number;
    garage?: number;
    area: number;
    builtArea?: number;
  };
  amenities: string[];
  images: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  acceptsExchange: boolean;
  acceptsFinancing: boolean;
  highlighted?: boolean;
  createdAt: Date;
}

export interface FilterOptions {
  searchTerm: string;
  type: PropertyType | 'todos';
  priceRange: [number, number];
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  garage?: number;
  minArea?: number;
  acceptsExchange?: boolean;
  acceptsFinancing?: boolean;
  furnished?: boolean;
  sortBy: 'recent' | 'price-asc' | 'price-desc' | 'area';
}
