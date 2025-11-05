import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Plus, Trash2, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyStore } from '@/store/propertyStore';
import { Property } from '@/types/property';
import { toast } from 'sonner';

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const addProperty = usePropertyStore((state) => state.addProperty);
  const updateProperty = usePropertyStore((state) => state.updateProperty);
  const getPropertyById = usePropertyStore((state) => state.getPropertyById);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('venda');
  const [status, setStatus] = useState('disponivel');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [garage, setGarage] = useState('0');
  const [area, setArea] = useState('');
  const [builtArea, setBuiltArea] = useState('');
  const [acceptsExchange, setAcceptsExchange] = useState(false);
  const [acceptsFinancing, setAcceptsFinancing] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const property = getPropertyById(id);
      if (property) {
        setTitle(property.title);
        setDescription(property.description);
        setType(property.type);
        setStatus(property.status);
        setPrice(property.price.toString());
        setCity(property.city);
        setNeighborhood(property.neighborhood);
        setBedrooms((property.features.bedrooms || 0).toString());
        setBathrooms((property.features.bathrooms || 0).toString());
        setGarage((property.features.garage || 0).toString());
        setArea(property.features.area.toString());
        setBuiltArea((property.features.builtArea || 0).toString());
        setAcceptsExchange(property.acceptsExchange || false);
        setAcceptsFinancing(property.acceptsFinancing || false);
        setHighlighted(property.highlighted || false);
        setAmenities(property.amenities || []);
        setImages(property.images || []);
      }
    }
  }, [isEditing, id, getPropertyById]);

  const handleAddAmenity = () => {
    if (newAmenity.trim() && amenities.length < 15) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = 15;
    const maxSize = 5 * 1024 * 1024; // 5MB

    Array.from(files).forEach((file) => {
      if (images.length >= maxImages) {
        toast.error(`Máximo de ${maxImages} imagens permitidas`);
        return;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} é muito grande. Máximo 5MB por imagem`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (!description.trim()) {
      toast.error('Descrição é obrigatória');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }

    if (!area || parseFloat(area) <= 0) {
      toast.error('Área total deve ser maior que zero');
      return;
    }

    if (!city.trim()) {
      toast.error('Cidade é obrigatória');
      return;
    }

    if (!neighborhood.trim()) {
      toast.error('Bairro é obrigatório');
      return;
    }

    if (images.length === 0) {
      toast.error('Adicione pelo menos uma imagem');
      return;
    }

    setIsSubmitting(true);

    const propertyData: Property = {
      id: isEditing && id ? id : Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      type: type as 'venda' | 'aluguel' | 'terreno',
      status: status as 'disponivel' | 'vendido' | 'alugado',
      price: parseFloat(price),
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      features: {
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        garage: parseInt(garage) || 0,
        area: parseFloat(area),
        builtArea: parseFloat(builtArea) || 0,
      },
      amenities,
      images,
      coordinates: { lat: 0, lng: 0 }, // Default coordinates
      acceptsExchange,
      acceptsFinancing,
      highlighted,
      createdAt: isEditing && id ? getPropertyById(id)?.createdAt || new Date() : new Date(),
    };

    try {
      if (isEditing && id) {
        updateProperty(id, propertyData);
        toast.success('Imóvel atualizado com sucesso!');
      } else {
        addProperty(propertyData);
        toast.success('Imóvel criado com sucesso!');
      }
      
      navigate('/admin/imoveis');
    } catch (error) {
      toast.error('Erro ao salvar imóvel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleLength = title.length;
  const descriptionLength = description.length;

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}
          </h1>
          <p className="text-muted-foreground">
            Preencha os campos abaixo para {isEditing ? 'atualizar' : 'cadastrar'} o imóvel
          </p>
        </div>

        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Casa Moderna em Cascavel"
                maxLength={100}
                required
              />
              <p className="text-xs text-muted-foreground">
                {titleLength}/100 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Descrição <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o imóvel com detalhes..."
                rows={5}
                maxLength={1000}
                required
              />
              <p className="text-xs text-muted-foreground">
                {descriptionLength}/1000 caracteres
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Tipo <span className="text-destructive">*</span>
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="aluguel">Aluguel</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                    <SelectItem value="alugado">Alugado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valores */}
        <Card>
          <CardHeader>
            <CardTitle>Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Preço <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="350000"
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="financing"
                checked={acceptsFinancing}
                onCheckedChange={(checked) => setAcceptsFinancing(checked as boolean)}
              />
              <Label htmlFor="financing" className="cursor-pointer">
                Aceita Financiamento
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="exchange"
                checked={acceptsExchange}
                onCheckedChange={(checked) => setAcceptsExchange(checked as boolean)}
              />
              <Label htmlFor="exchange" className="cursor-pointer">
                Aceita Permuta
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="highlighted"
                checked={highlighted}
                onCheckedChange={(checked) => setHighlighted(checked as boolean)}
              />
              <Label htmlFor="highlighted" className="cursor-pointer">
                Destacar na Home
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardHeader>
            <CardTitle>Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  Cidade <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Cascavel"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">
                  Bairro <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Centro"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Características */}
        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="garage">Garagem</Label>
                <Input
                  id="garage"
                  type="number"
                  value={garage}
                  onChange={(e) => setGarage(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">
                  Área Total (m²) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="area"
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="180"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="builtArea">Área Construída (m²)</Label>
              <Input
                id="builtArea"
                type="number"
                value={builtArea}
                onChange={(e) => setBuiltArea(e.target.value)}
                placeholder="150"
                min="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Destaques/Comodidades */}
        <Card>
          <CardHeader>
            <CardTitle>Destaques & Comodidades</CardTitle>
            <p className="text-sm text-muted-foreground">
              {amenities.length}/15 destaques adicionados
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Ex: Piscina"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
              />
              <Button
                type="button"
                onClick={handleAddAmenity}
                disabled={amenities.length >= 15 || !newAmenity.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="bg-muted px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Imagens */}
        <Card>
          <CardHeader>
            <CardTitle>
              Imagens <span className="text-destructive">*</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {images.length}/15 imagens • Máximo 5MB por imagem
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={images.length >= 15}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer block"
              >
                <p className="text-muted-foreground mb-2">
                  Arraste fotos aqui ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG ou WEBP • Máximo 5MB cada
                </p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {index + 1}
                    </div>
                    {index === 0 && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded">
                        <Star className="w-4 h-4" fill="currentColor" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute bottom-2 right-2 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-background py-4 border-t">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar e Publicar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate('/admin/imoveis')}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default PropertyForm;
