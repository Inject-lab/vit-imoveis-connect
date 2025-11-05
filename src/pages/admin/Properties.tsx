import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Eye, Pencil, Trash2, Plus, Search } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/store/propertyStore';
import { formatPrice } from '@/utils/whatsapp';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminProperties = () => {
  const properties = usePropertyStore((state) => state.properties);
  const deleteProperty = usePropertyStore((state) => state.deleteProperty);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
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

  const handleDelete = (id: string) => {
    deleteProperty(id);
    toast.success('Imóvel deletado com sucesso');
  };

  const formatDate = (createdAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(createdAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoje';
    if (days === 1) return '1 dia atrás';
    if (days < 30) return `${days} dias atrás`;
    if (days < 60) return '1 mês atrás';
    return `${Math.floor(days / 30)} meses atrás`;
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'disponivel' && property.status === 'disponivel') ||
      (statusFilter === 'vendidos' && property.status !== 'disponivel');

    return matchesSearch && matchesStatus;
  });

  const totalCount = filteredProperties.length;
  const displayedCount = Math.min(20, totalCount);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciar Imóveis</h1>
            <p className="text-muted-foreground">
              {totalCount} {totalCount === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/admin/imoveis/novo">
              <Plus className="w-5 h-5 mr-2" />
              Novo Imóvel
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="disponivel">Disponíveis</TabsTrigger>
            <TabsTrigger value="vendidos">Vendidos/Alugados</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Table or Empty State */}
        {filteredProperties.length === 0 ? (
          <div className="bg-background border rounded-lg p-12 text-center">
            <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? 'Nenhum imóvel encontrado' : 'Nenhum imóvel cadastrado'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? 'Tente buscar com outros termos'
                : 'Comece adicionando seu primeiro imóvel'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/admin/imoveis/novo">+ Criar Primeiro Imóvel</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-background border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium">Imóvel</th>
                      <th className="text-left p-4 text-sm font-medium">Tipo</th>
                      <th className="text-left p-4 text-sm font-medium">Cidade</th>
                      <th className="text-left p-4 text-sm font-medium">Preço</th>
                      <th className="text-left p-4 text-sm font-medium">Status</th>
                      <th className="text-left p-4 text-sm font-medium">Criado</th>
                      <th className="text-right p-4 text-sm font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.slice(0, 20).map((property) => {
                      const statusInfo = getStatusBadge(property.status);
                      return (
                        <tr key={property.id} className="border-t hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-14 h-14 rounded object-cover"
                              />
                              <span className="font-medium">{property.title}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{getTypeBadge(property.type)}</Badge>
                          </td>
                          <td className="p-4">{property.city}</td>
                          <td className="p-4 font-medium">
                            {formatPrice(property.price, property.type)}
                          </td>
                          <td className="p-4">
                            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatDate(property.createdAt)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title="Ver no site"
                              >
                                <a
                                  href={`/imoveis/${property.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </Button>
                              <Button variant="ghost" size="icon" asChild title="Editar">
                                <Link to={`/admin/imoveis/${property.id}/editar`}>
                                  <Pencil className="w-4 h-4" />
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" title="Deletar">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Tem certeza que quer deletar este imóvel?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Essa ação não pode ser desfeita. O imóvel será
                                      permanentemente removido do sistema.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(property.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Deletar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredProperties.slice(0, 20).map((property) => {
                const statusInfo = getStatusBadge(property.status);
                return (
                  <div
                    key={property.id}
                    className="bg-background border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{property.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">{getTypeBadge(property.type)}</Badge>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{property.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="font-semibold">
                        {formatPrice(property.price, property.type)}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={`/imoveis/${property.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/imoveis/${property.id}/editar`}>
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Tem certeza que quer deletar este imóvel?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(property.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Deletar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Info */}
            {totalCount > 20 && (
              <div className="text-center text-sm text-muted-foreground">
                Mostrando {displayedCount} de {totalCount} imóveis
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
