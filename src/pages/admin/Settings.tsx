import { useState } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Settings = () => {
  const [sellerName, setSellerName] = useState('Silvio Vitória Sobrinho');
  const [sellerPhone, setSellerPhone] = useState('554599020888');
  const [sellerEmail, setSellerEmail] = useState('silviovit@hotmail.com');
  const [sellerBio, setSellerBio] = useState(
    'Mais de 30 anos de experiência no mercado imobiliário da região oeste do Paraná, oferecendo os melhores imóveis com atendimento personalizado e transparente.'
  );
  const [whatsappNumber, setWhatsappNumber] = useState('554599020888');
  const [metaDescription, setMetaDescription] = useState(
    'Encontre os melhores imóveis para venda e aluguel na região oeste do Paraná com Silvio Vitória. Mais de 30 anos de experiência no mercado.'
  );
  const [keywords, setKeywords] = useState(
    'imóveis cascavel, casas venda paraná, imóveis oeste paraná, silvio vitória imóveis'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular salvamento
    setTimeout(() => {
      const settings = {
        seller: {
          name: sellerName,
          phone: sellerPhone,
          email: sellerEmail,
          bio: sellerBio,
        },
        site: {
          whatsapp: whatsappNumber,
          metaDescription,
          keywords,
        },
      };

      localStorage.setItem('site-settings', JSON.stringify(settings));
      toast.success('Configurações salvas com sucesso!');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Configure as informações do vendedor e do site
          </p>
        </div>

        {/* Informações do Vendedor */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Vendedor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sellerName">Nome</Label>
              <Input
                id="sellerName"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="Silvio Vitória Sobrinho"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sellerPhone">Telefone</Label>
                <Input
                  id="sellerPhone"
                  type="tel"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="554599020888"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerEmail">Email</Label>
                <Input
                  id="sellerEmail"
                  type="email"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  placeholder="silviovit@hotmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellerBio">Biografia</Label>
              <Textarea
                id="sellerBio"
                value={sellerBio}
                onChange={(e) => setSellerBio(e.target.value)}
                rows={4}
                placeholder="Descrição breve sobre o vendedor..."
              />
              <p className="text-xs text-muted-foreground">
                Aparece na seção "Sobre" da home
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Site */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Site</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="554599020888"
              />
              <p className="text-xs text-muted-foreground">
                Número usado nos botões de contato (incluir código do país e DDD)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                maxLength={160}
                placeholder="Descrição do site para SEO..."
              />
              <p className="text-xs text-muted-foreground">
                {metaDescription.length}/160 caracteres • Aparece nos resultados de busca
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Palavras-chave</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="palavra1, palavra2, palavra3"
              />
              <p className="text-xs text-muted-foreground">
                Separe as palavras-chave com vírgula
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default Settings;
