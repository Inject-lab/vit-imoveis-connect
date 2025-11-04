import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getGeneralWhatsAppLink } from '@/utils/whatsapp';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury real estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-accent text-accent-foreground px-4 py-2 text-sm font-medium">
                ✓ Aceita Permuta 40%
              </Badge>
              <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
                ✓ Financiamento Bancário
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium">
                ✓ Múltiplas Cidades
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Silvio Vitória Sobrinho
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              Construindo sonhos com qualidade e confiança
            </p>

            <p className="text-base md:text-lg text-white/80 max-w-2xl">
              Imóveis próprios para venda e locação. Aceito permuta de até 40% do valor em carros, casas, apartamentos e terrenos.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                variant="whatsapp"
                className="text-lg h-14 px-8"
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
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary text-lg h-14 px-8"
              >
                <Link to="/imoveis">
                  Ver Imóveis Disponíveis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="flex flex-col items-center text-white/70">
          <span className="text-xs uppercase tracking-wider mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-12 bg-white/50"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
