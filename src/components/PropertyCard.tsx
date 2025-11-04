import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bed, Bath, Car, Square, MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';
import { usePropertyStore } from '@/store/propertyStore';
import { formatPrice, getPropertyWhatsAppLink } from '@/utils/whatsapp';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { favorites, toggleFavorite } = usePropertyStore();
  const isFavorite = favorites.includes(property.id);

  const statusColors = {
    disponivel: 'bg-green-500',
    vendido: 'bg-gray-500',
    alugado: 'bg-blue-500',
  };

  const typeLabels = {
    venda: 'Venda',
    aluguel: 'Aluguel',
    terreno: 'Terreno',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden hover-lift group h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`${statusColors[property.status]} text-white border-none`}>
              {property.status === 'disponivel' ? 'Disponível' : property.status === 'vendido' ? 'Vendido' : 'Alugado'}
            </Badge>
            <Badge className="bg-primary text-primary-foreground border-none">
              {typeLabels[property.type]}
            </Badge>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(property.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          {/* WhatsApp Quick Action */}
          <a
            href={getPropertyWhatsAppLink(property)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(142,71%,40%)] hover:scale-110 transition-all shadow-lg"
            aria-label="Contact via WhatsApp"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        <CardContent className="p-5">
          {/* Location */}
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.city} - {property.neighborhood}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-3 line-clamp-2 min-h-[56px]">
            {property.title}
          </h3>

          {/* Price */}
          <div className="text-2xl font-bold text-primary mb-4">
            {formatPrice(property.price, property.type)}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-4 mb-4 text-muted-foreground">
            {property.features.bedrooms && (
              <div className="flex items-center text-sm">
                <Bed className="w-4 h-4 mr-1.5" />
                <span>{property.features.bedrooms}</span>
              </div>
            )}
            {property.features.bathrooms && (
              <div className="flex items-center text-sm">
                <Bath className="w-4 h-4 mr-1.5" />
                <span>{property.features.bathrooms}</span>
              </div>
            )}
            {property.features.garage !== undefined && (
              <div className="flex items-center text-sm">
                <Car className="w-4 h-4 mr-1.5" />
                <span>{property.features.garage}</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Square className="w-4 h-4 mr-1.5" />
              <span>{property.features.area}m²</span>
            </div>
          </div>

          {/* Action Button */}
          <Button asChild variant="outline" className="w-full">
            <Link to={`/imoveis/${property.id}`}>
              Ver Detalhes
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;
