import { create } from 'zustand';
import { Property, FilterOptions } from '@/types/property';

interface PropertyState {
  properties: Property[];
  favorites: string[];
  filters: FilterOptions;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  toggleFavorite: (id: string) => void;
  getFilteredProperties: () => Property[];
  getPropertyById: (id: string) => Property | undefined;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, property: Property) => void;
  deleteProperty: (id: string) => void;
}

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Casa Moderna em Cascavel',
    description: 'Linda casa em condomínio fechado com amplo espaço e acabamento de primeira qualidade. Localizada em área nobre de Cascavel, próxima a escolas, shopping e principais avenidas. Perfeita para famílias que buscam conforto e segurança.',
    type: 'venda',
    status: 'disponivel',
    price: 450000,
    city: 'Cascavel',
    neighborhood: 'Cascavel Velho',
    features: {
      bedrooms: 3,
      bathrooms: 2,
      garage: 2,
      area: 180,
      builtArea: 150
    },
    amenities: ['Piscina', 'Churrasqueira', 'Quintal', 'Área de serviço', 'Varanda'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop'
    ],
    coordinates: { lat: -24.9555, lng: -53.4552 },
    acceptsExchange: true,
    acceptsFinancing: true,
    highlighted: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Apartamento Centro de Foz do Iguaçu',
    description: 'Apartamento amplo e bem localizado no centro de Foz do Iguaçu. Próximo a todos os serviços e comércios. Excelente para investimento ou moradia. Vista privilegiada da cidade.',
    type: 'aluguel',
    status: 'disponivel',
    price: 2500,
    city: 'Foz do Iguaçu',
    neighborhood: 'Centro',
    features: {
      bedrooms: 2,
      bathrooms: 1,
      garage: 1,
      area: 85,
      builtArea: 85
    },
    amenities: ['Elevador', 'Sacada', 'Portaria 24h', 'Área de serviço'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260066-6bc2557208d0?w=800&h=600&fit=crop'
    ],
    coordinates: { lat: -25.5478, lng: -54.5882 },
    acceptsExchange: false,
    acceptsFinancing: false,
    highlighted: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    title: 'Terreno 500m² em Toledo',
    description: 'Excelente terreno plano em localização privilegiada em Toledo. Ideal para construção de casa ou investimento. Área nobre e em crescimento, próximo a supermercados e farmácias.',
    type: 'terreno',
    status: 'disponivel',
    price: 280000,
    city: 'Toledo',
    neighborhood: 'Jardim Europa',
    features: {
      area: 500
    },
    amenities: ['Esquina', 'Plano', 'Água', 'Luz', 'Esgoto'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800&h=600&fit=crop'
    ],
    coordinates: { lat: -24.7136, lng: -53.7433 },
    acceptsExchange: true,
    acceptsFinancing: true,
    highlighted: false,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '4',
    title: 'Casa 4 Quartos em Maringá',
    description: 'Ampla casa com 4 quartos sendo 2 suítes, em excelente localização em Maringá. Casa com ótimo acabamento, quintal espaçoso e garagem coberta para 3 carros. Perfeita para famílias grandes.',
    type: 'venda',
    status: 'disponivel',
    price: 680000,
    city: 'Maringá',
    neighborhood: 'Zona 7',
    features: {
      bedrooms: 4,
      bathrooms: 3,
      garage: 3,
      area: 320,
      builtArea: 250
    },
    amenities: ['Piscina', 'Churrasqueira', 'Quintal amplo', 'Área gourmet', 'Edícula'],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
    ],
    coordinates: { lat: -23.4205, lng: -51.9333 },
    acceptsExchange: true,
    acceptsFinancing: true,
    highlighted: true,
    createdAt: new Date('2024-01-25')
  },
  {
    id: '5',
    title: 'Apartamento 3 Quartos - Cascavel',
    description: 'Apartamento amplo com 3 quartos, sendo 1 suíte. Localizado em prédio moderno com área de lazer completa. Próximo a universidades e hospitais. Excelente oportunidade.',
    type: 'aluguel',
    status: 'disponivel',
    price: 1800,
    city: 'Cascavel',
    neighborhood: 'Universitário',
    features: {
      bedrooms: 3,
      bathrooms: 2,
      garage: 2,
      area: 95,
      builtArea: 95
    },
    amenities: ['Piscina', 'Academia', 'Salão de festas', 'Playground', 'Churrasqueira'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800&h=600&fit=crop'
    ],
    coordinates: { lat: -24.9778, lng: -53.4583 },
    acceptsExchange: false,
    acceptsFinancing: false,
    highlighted: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '6',
    title: 'Casa em Condomínio - Foz do Iguaçu',
    description: 'Casa térrea em condomínio fechado de alto padrão. Segurança 24h, área verde e clube completo. Perfeita para quem busca tranquilidade e qualidade de vida.',
    type: 'venda',
    status: 'disponivel',
    price: 520000,
    city: 'Foz do Iguaçu',
    neighborhood: 'Três Lagoas',
    features: {
      bedrooms: 3,
      bathrooms: 2,
      garage: 2,
      area: 250,
      builtArea: 160
    },
    amenities: ['Clube', 'Segurança', 'Área verde', 'Churrasqueira', 'Varanda'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'
    ],
    coordinates: { lat: -25.5163, lng: -54.5854 },
    acceptsExchange: true,
    acceptsFinancing: true,
    highlighted: true,
    createdAt: new Date('2024-01-28')
  }
];

const defaultFilters: FilterOptions = {
  searchTerm: '',
  type: 'todos',
  priceRange: [0, 1000000],
  city: '',
  sortBy: 'recent'
};

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: mockProperties,
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  filters: defaultFilters,

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  resetFilters: () => set({ filters: defaultFilters }),

  toggleFavorite: (id) => set((state) => {
    const favorites = state.favorites.includes(id)
      ? state.favorites.filter((fav) => fav !== id)
      : [...state.favorites, id];
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return { favorites };
  }),

  getFilteredProperties: () => {
    const { properties, filters } = get();
    
    return properties.filter((property) => {
      // Search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(searchLower) ||
          property.city.toLowerCase().includes(searchLower) ||
          property.neighborhood.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Type
      if (filters.type !== 'todos' && property.type !== filters.type) {
        return false;
      }

      // Price range
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }

      // City
      if (filters.city && property.city !== filters.city) {
        return false;
      }

      // Bedrooms
      if (filters.bedrooms && property.features.bedrooms !== filters.bedrooms) {
        return false;
      }

      // Bathrooms
      if (filters.bathrooms && property.features.bathrooms !== filters.bathrooms) {
        return false;
      }

      // Garage
      if (filters.garage !== undefined && property.features.garage !== filters.garage) {
        return false;
      }

      // Min area
      if (filters.minArea && property.features.area < filters.minArea) {
        return false;
      }

      // Accepts exchange
      if (filters.acceptsExchange && !property.acceptsExchange) {
        return false;
      }

      // Accepts financing
      if (filters.acceptsFinancing && !property.acceptsFinancing) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'area':
          return b.features.area - a.features.area;
        case 'recent':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  },

  getPropertyById: (id) => {
    return get().properties.find((p) => p.id === id);
  },

  addProperty: (property) => set((state) => {
    const properties = [...state.properties, property];
    localStorage.setItem('properties', JSON.stringify(properties));
    return { properties };
  }),

  updateProperty: (id, updatedProperty) => set((state) => {
    const properties = state.properties.map((p) => 
      p.id === id ? updatedProperty : p
    );
    localStorage.setItem('properties', JSON.stringify(properties));
    return { properties };
  }),

  deleteProperty: (id) => set((state) => {
    const properties = state.properties.filter((p) => p.id !== id);
    localStorage.setItem('properties', JSON.stringify(properties));
    return { properties };
  })
}));
