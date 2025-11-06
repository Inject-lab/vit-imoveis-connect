-- Create enum for property types
CREATE TYPE public.property_type AS ENUM ('venda', 'aluguel', 'terreno');

-- Create enum for property status
CREATE TYPE public.property_status AS ENUM ('disponivel', 'vendido', 'alugado');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type property_type NOT NULL,
  status property_status NOT NULL DEFAULT 'disponivel',
  price DECIMAL(12,2) NOT NULL,
  price_rent DECIMAL(12,2),
  accepts_financing BOOLEAN DEFAULT false,
  accepts_exchange BOOLEAN DEFAULT false,
  exchange_percentage INTEGER CHECK (exchange_percentage >= 0 AND exchange_percentage <= 100),
  
  -- Location
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT,
  complement TEXT,
  cep TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Features
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  garages INTEGER DEFAULT 0,
  area_total DECIMAL(10,2) NOT NULL,
  area_built DECIMAL(10,2),
  furnished BOOLEAN DEFAULT false,
  
  -- Additional
  highlights TEXT[] DEFAULT '{}',
  images JSONB DEFAULT '[]',
  highlighted BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table for admin management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create function to check user role (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for properties
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties (public can view available properties)
CREATE POLICY "Anyone can view available properties"
  ON public.properties
  FOR SELECT
  USING (status = 'disponivel' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert properties"
  ON public.properties
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update properties"
  ON public.properties
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete properties"
  ON public.properties
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- Insert mock properties data
INSERT INTO public.properties (
  title, description, type, status, price, city, state, neighborhood,
  bedrooms, bathrooms, garages, area_total, area_built,
  highlights, images, accepts_financing, accepts_exchange, highlighted,
  latitude, longitude, created_at
) VALUES
(
  'Casa Moderna em Cascavel',
  'Linda casa em condomínio fechado com amplo espaço e acabamento de primeira qualidade. Localizada em área nobre de Cascavel, próxima a escolas, shopping e principais avenidas. Perfeita para famílias que buscam conforto e segurança.',
  'venda', 'disponivel', 450000, 'Cascavel', 'PR', 'Cascavel Velho',
  3, 2, 2, 180, 150,
  ARRAY['Piscina', 'Churrasqueira', 'Quintal', 'Área de serviço', 'Varanda'],
  '[{"id":"1","url":"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop","alt":"Fachada"},{"id":"2","url":"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop","alt":"Interior"},{"id":"3","url":"https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop","alt":"Sala"}]'::jsonb,
  true, true, true,
  -24.9555, -53.4552, '2024-01-15'
),
(
  'Apartamento Centro de Foz do Iguaçu',
  'Apartamento amplo e bem localizado no centro de Foz do Iguaçu. Próximo a todos os serviços e comércios. Excelente para investimento ou moradia. Vista privilegiada da cidade.',
  'aluguel', 'disponivel', 2500, 'Foz do Iguaçu', 'PR', 'Centro',
  2, 1, 1, 85, 85,
  ARRAY['Elevador', 'Sacada', 'Portaria 24h', 'Área de serviço'],
  '[{"id":"1","url":"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop","alt":"Living"},{"id":"2","url":"https://images.unsplash.com/photo-1502672260066-6bc2557208d0?w=800&h=600&fit=crop","alt":"Quarto"}]'::jsonb,
  false, false, true,
  -25.5478, -54.5882, '2024-01-20'
),
(
  'Terreno 500m² em Toledo',
  'Excelente terreno plano em localização privilegiada em Toledo. Ideal para construção de casa ou investimento. Área nobre e em crescimento, próximo a supermercados e farmácias.',
  'terreno', 'disponivel', 280000, 'Toledo', 'PR', 'Jardim Europa',
  0, 0, 0, 500, NULL,
  ARRAY['Esquina', 'Plano', 'Água', 'Luz', 'Esgoto'],
  '[{"id":"1","url":"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop","alt":"Terreno"},{"id":"2","url":"https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800&h=600&fit=crop","alt":"Vista"}]'::jsonb,
  true, true, false,
  -24.7136, -53.7433, '2024-01-10'
),
(
  'Casa 4 Quartos em Maringá',
  'Ampla casa com 4 quartos sendo 2 suítes, em excelente localização em Maringá. Casa com ótimo acabamento, quintal espaçoso e garagem coberta para 3 carros. Perfeita para famílias grandes.',
  'venda', 'disponivel', 680000, 'Maringá', 'PR', 'Zona 7',
  4, 3, 3, 320, 250,
  ARRAY['Piscina', 'Churrasqueira', 'Quintal amplo', 'Área gourmet', 'Edícula'],
  '[{"id":"1","url":"https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop","alt":"Fachada"},{"id":"2","url":"https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=600&fit=crop","alt":"Interior"},{"id":"3","url":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop","alt":"Piscina"}]'::jsonb,
  true, true, true,
  -23.4205, -51.9333, '2024-01-25'
),
(
  'Apartamento 3 Quartos - Cascavel',
  'Apartamento amplo com 3 quartos, sendo 1 suíte. Localizado em prédio moderno com área de lazer completa. Próximo a universidades e hospitais. Excelente oportunidade.',
  'aluguel', 'disponivel', 1800, 'Cascavel', 'PR', 'Universitário',
  3, 2, 2, 95, 95,
  ARRAY['Piscina', 'Academia', 'Salão de festas', 'Playground', 'Churrasqueira'],
  '[{"id":"1","url":"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop","alt":"Sala"},{"id":"2","url":"https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800&h=600&fit=crop","alt":"Cozinha"}]'::jsonb,
  false, false, true,
  -24.9778, -53.4583, '2024-02-01'
),
(
  'Casa em Condomínio - Foz do Iguaçu',
  'Casa térrea em condomínio fechado de alto padrão. Segurança 24h, área verde e clube completo. Perfeita para quem busca tranquilidade e qualidade de vida.',
  'venda', 'disponivel', 520000, 'Foz do Iguaçu', 'PR', 'Três Lagoas',
  3, 2, 2, 250, 160,
  ARRAY['Clube', 'Segurança', 'Área verde', 'Churrasqueira', 'Varanda'],
  '[{"id":"1","url":"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop","alt":"Fachada"},{"id":"2","url":"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop","alt":"Interior"}]'::jsonb,
  true, true, true,
  -25.5163, -54.5854, '2024-01-28'
);