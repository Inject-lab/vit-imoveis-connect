import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">
              Silvio Vitória Sobrinho
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Construindo sonhos com qualidade e confiança há anos. Imóveis próprios para venda e locação.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/imoveis" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Imóveis
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-muted-foreground text-sm">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <a href="tel:5545999020888" className="hover:text-primary transition-colors">
                  (45) 99902-0888
                </a>
              </li>
              <li className="flex items-center text-muted-foreground text-sm">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                <a href="mailto:silviovit@hotmail.com" className="hover:text-primary transition-colors">
                  silviovit@hotmail.com
                </a>
              </li>
              <li className="flex items-start text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <span>Atendimento em Cascavel, Foz do Iguaçu, Toledo, Maringá e região</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Silvio Vitória Sobrinho. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
