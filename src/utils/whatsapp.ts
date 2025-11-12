import { Property } from '@/types/property';

// WhatsApp número correto no formato internacional
const WHATSAPP_NUMBER = '5545990208888';

export const getWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  // Usando formato oficial wa.me conforme documentação WhatsApp
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export const getPropertyWhatsAppLink = (property: Property): string => {
  const message = `Olá Silvio! Tenho interesse no imóvel "${property.title}" em ${property.city} - ${property.neighborhood}. Poderia me dar mais informações?

Preço: ${formatPrice(property.price, property.type)}
Código: #${property.id}`;
  
  return getWhatsAppLink(message);
};

export const getGeneralWhatsAppLink = (): string => {
  const message = 'Olá Silvio! Gostaria de saber mais sobre os imóveis disponíveis.';
  return getWhatsAppLink(message);
};

export const formatPrice = (price: number, type: string): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + (type === 'aluguel' ? '/mês' : '');
};
