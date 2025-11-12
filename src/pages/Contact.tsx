import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { getGeneralWhatsAppLink } from '@/utils/whatsapp';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefone / WhatsApp',
      content: '(45) 99020-888',
      link: 'tel:554599020888',
      color: 'bg-green-500',
    },
    {
      icon: Mail,
      title: 'E-mail',
      content: 'silviovit@hotmail.com',
      link: 'mailto:silviovit@hotmail.com',
      color: 'bg-primary',
    },
    {
      icon: MapPin,
      title: 'Atendimento',
      content: 'Cascavel e regiões - PR/SC',
      color: 'bg-secondary',
    },
    {
      icon: Clock,
      title: 'Horário',
      content: 'Segunda a Sábado: 8h às 18h',
      color: 'bg-accent',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Entre em Contato</h1>
              <p className="text-xl text-white/90">
                Estou à disposição para tirar suas dúvidas e ajudar você a encontrar o imóvel ideal
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 -mt-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="hover-lift border-none shadow-lg">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`inline-flex p-4 rounded-2xl ${item.color} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-muted-foreground hover:text-primary transition-colors text-sm"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-muted-foreground text-sm">{item.content}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA */}
            <Card className="max-w-2xl mx-auto border-none shadow-xl">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Pronto para começar?
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Entre em contato agora mesmo pelo WhatsApp e descubra as melhores oportunidades
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    variant="whatsapp"
                    className="text-base"
                  >
                    <a
                      href={getGeneralWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Falar no WhatsApp
                    </a>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-base"
                  >
                    <a href="tel:554599020888">
                      <Phone className="w-5 h-5 mr-2" />
                      Ligar Agora
                    </a>
                  </Button>
                </div>

                {/* Benefits */}
                <div className="pt-6 space-y-2 text-sm text-muted-foreground border-t">
                  <p>✓ Aceito permuta de até 40%</p>
                  <p>✓ Facilito financiamento bancário</p>
                  <p>✓ Atendimento personalizado</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
