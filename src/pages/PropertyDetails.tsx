import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bed, Bath, Car, Maximize, MapPin, Share2, Expand } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/store/propertyStore';
import { getPropertyWhatsAppLink, formatPrice } from '@/utils/whatsapp';
import { useToast } from '@/hooks/use-toast';
import NotFound from './NotFound';
import ImageLightbox from '@/components/ImageLightbox';

const PropertyDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const getPropertyById = usePropertyStore((state) => state.getPropertyById);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const property = id ? getPropertyById(id) : undefined;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link do imóvel foi copiado para a área de transferência.",
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!property) {
    return <NotFound />;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' }> = {
      disponivel: { label: 'Disponível', variant: 'default' },
      vendido: { label: 'Vendido', variant: 'secondary' },
      alugado: { label: 'Alugado', variant: 'secondary' },
    };
    return variants[status] || variants.disponivel;
  };

  const getTypeBadge = (type: string) => {
    const types: Record<string, string> = {
      venda: 'Venda',
      aluguel: 'Aluguel',
      terreno: 'Terreno',
    };
    return types[type] || type;
  };

  const statusInfo = getStatusBadge(property.status);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/imoveis">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para imóveis
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Gallery */}
            <div className="space-y-4">
              <div 
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                    <Expand className="w-6 h-6 text-primary" />
                  </div>
                </div>
                {property.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {property.images.length} fotos
                  </div>
                )}
              </div>
              
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {property.images.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group relative"
                      onClick={() => {
                        setLightboxIndex(index + 1);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${property.title} - ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 3 && property.images.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            +{property.images.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{getTypeBadge(property.type)}</Badge>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                {property.acceptsExchange && (
                  <Badge variant="secondary">Aceita Permuta</Badge>
                )}
                {property.acceptsFinancing && (
                  <Badge variant="secondary">Aceita Financiamento</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {property.title}
              </h1>
              
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                <span>
                  {property.neighborhood}, {property.city}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-3">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.type !== 'terreno' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Características</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.features.bedrooms !== undefined && property.features.bedrooms > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Bed className="w-6 h-6 text-primary" />
                      <div>
                        <div className="font-semibold">{property.features.bedrooms}</div>
                        <div className="text-sm text-muted-foreground">Quartos</div>
                      </div>
                    </div>
                  )}
                  
                  {property.features.bathrooms !== undefined && property.features.bathrooms > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Bath className="w-6 h-6 text-primary" />
                      <div>
                        <div className="font-semibold">{property.features.bathrooms}</div>
                        <div className="text-sm text-muted-foreground">Banheiros</div>
                      </div>
                    </div>
                  )}
                  
                  {property.features.garage !== undefined && property.features.garage > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Car className="w-6 h-6 text-primary" />
                      <div>
                        <div className="font-semibold">{property.features.garage}</div>
                        <div className="text-sm text-muted-foreground">Garagem</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Maximize className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-semibold">{property.features.area}m²</div>
                      <div className="text-sm text-muted-foreground">Área Total</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Comodidades</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="bg-muted px-4 py-2 rounded-lg text-sm"
                    >
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-background border rounded-lg p-6 sticky top-24 space-y-6">
              {/* Price */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Preço</div>
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(property.price, property.type)}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <a
                    href={getPropertyWhatsAppLink(property)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tenho Interesse
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              {/* Property Info */}
              <div className="pt-6 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Código</span>
                  <span className="font-medium">#{property.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tipo</span>
                  <span className="font-medium">{getTypeBadge(property.type)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={statusInfo.variant} className="text-xs">
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Image Lightbox */}
      <ImageLightbox
        images={property.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default PropertyDetails;
