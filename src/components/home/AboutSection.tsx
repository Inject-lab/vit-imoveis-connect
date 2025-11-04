import { motion } from 'framer-motion';
import { CheckCircle2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';
import { getGeneralWhatsAppLink } from '@/utils/whatsapp';
import silvioPhoto from '@/assets/silvio-photo.jpg';

const AboutSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const benefits = [
    'Aceita até 40% em permuta (carros, casas, apartamentos, terrenos)',
    'Aceita financiamento bancário',
    'Imóveis em várias cidades (Cascavel, Foz, Toledo, Maringá)',
    'Construtor com anos de experiência no mercado',
    'Imóveis próprios - venda direta do construtor',
    'Atendimento personalizado e transparente',
  ];

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={silvioPhoto}
                alt="Silvio Vitória Sobrinho"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl"
            >
              <div className="text-center">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Anos de experiência</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Sobre Silvio Vitória Sobrinho
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Com mais de 15 anos de experiência no mercado imobiliário, construo e vendo imóveis próprios com qualidade e transparência. Meu compromisso é realizar o sonho da casa própria de cada família.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Diferenciais:</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <Button
              asChild
              size="lg"
              variant="whatsapp"
              className="text-base mt-4"
            >
              <a
                href={getGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="w-5 h-5 mr-2" />
                Entrar em Contato
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
