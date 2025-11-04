import { motion } from 'framer-motion';
import { Home, Key, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { usePropertyStore } from '@/store/propertyStore';
import { useInView } from 'react-intersection-observer';

const CategoryCards = () => {
  const properties = usePropertyStore((state) => state.properties);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const categories = [
    {
      title: 'Casas à Venda',
      icon: Home,
      count: properties.filter((p) => p.type === 'venda' && p.features.bedrooms).length,
      link: '/imoveis?type=venda',
      color: 'primary',
    },
    {
      title: 'Imóveis para Alugar',
      icon: Key,
      count: properties.filter((p) => p.type === 'aluguel').length,
      link: '/imoveis?type=aluguel',
      color: 'secondary',
    },
    {
      title: 'Terrenos Disponíveis',
      icon: MapPin,
      count: properties.filter((p) => p.type === 'terreno').length,
      link: '/imoveis?type=terreno',
      color: 'accent',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section ref={ref} className="py-16 md:py-24 -mt-16 relative z-20">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            const colorClasses = {
              primary: 'bg-primary text-primary-foreground',
              secondary: 'bg-secondary text-secondary-foreground',
              accent: 'bg-accent text-accent-foreground',
            };

            return (
              <motion.div key={category.title} variants={cardVariants}>
                <Card className="hover-lift cursor-pointer group h-full border-none shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-2xl ${colorClasses[category.color as keyof typeof colorClasses]} transition-transform group-hover:scale-110`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-xl font-bold">{category.title}</h3>
                      
                      <div className="text-4xl font-bold text-primary">
                        {category.count}
                      </div>
                      
                      <p className="text-muted-foreground text-sm">
                        {category.count === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
                      </p>

                      <Button
                        asChild
                        variant="outline"
                        className="w-full mt-2"
                      >
                        <Link to={category.link}>
                          Ver {category.title.split(' ')[0]}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryCards;
