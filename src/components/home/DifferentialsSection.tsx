import { motion } from 'framer-motion';
import { RefreshCw, Building2, MapPin, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useInView } from 'react-intersection-observer';

const DifferentialsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const differentials = [
    {
      icon: RefreshCw,
      title: 'Aceita Permuta',
      description: 'Aceito até 40% do valor em carros, casas, apartamentos ou terrenos',
      color: 'bg-accent',
    },
    {
      icon: Building2,
      title: 'Financiamento',
      description: 'Trabalho com todos os bancos para facilitar seu financiamento',
      color: 'bg-primary',
    },
    {
      icon: MapPin,
      title: 'Múltiplas Localizações',
      description: 'Imóveis em Cascavel e regiões - PR/SC',
      color: 'bg-secondary',
    },
    {
      icon: Home,
      title: 'Imóveis Próprios',
      description: 'Construtor há mais de 15 anos, venda direta sem intermediários',
      color: 'bg-green-500',
    },
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher Silvio Vitória?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Facilidades e vantagens que tornam seu sonho realidade
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {differentials.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full border-none shadow-lg hover-lift">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`inline-flex p-4 rounded-2xl ${item.color} text-white`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
