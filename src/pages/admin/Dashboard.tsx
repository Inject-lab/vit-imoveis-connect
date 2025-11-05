import { Link } from 'react-router-dom';
import { Home, Check, HandshakeIcon, MapPin, Eye, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const Dashboard = () => {
  const properties = usePropertyStore((state) => state.properties);
  const deleteProperty = usePropertyStore((state) => state.deleteProperty);

  const totalProperties = properties.length;
  const availableProperties = properties.filter((p) => p.status === 'disponivel').length;
  const soldProperties = properties.filter((p) => p.status !== 'disponivel').length;
  const uniqueCities = new Set(properties.map((p) => p.city)).size;

  const recentProperties = properties
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);

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

  const formatDate = (id: string) => {
    // Simple relative date based on ID
    return 'Recente';
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral dos imóveis cadastrados
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Imóveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Home className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-3xl font-bold">{totalProperties}</div>
                  <p className="text-xs text-muted-foreground">cadastrados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Check className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <div className="text-3xl font-bold">{availableProperties}</div>
                  <p className="text-xs text-muted-foreground">à venda/aluguel</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vendidos/Alugados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <HandshakeIcon className="w-8 h-8 text-gray-500 mr-3" />
                <div>
                  <div className="text-3xl font-bold">{soldProperties}</div>
                  <p className="text-xs text-muted-foreground">finalizados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MapPin className="w-8 h-8 text-orange-500 mr-3" />
                <div>
                  <div className="text-3xl font-bold">{uniqueCities}</div>
                  <p className="text-xs text-muted-foreground">atendidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Properties Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Imóveis Adicionados Recentemente</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Últimos 5 imóveis cadastrados
              </p>
            </div>
            <Button asChild>
              <Link to="/admin/imoveis">Ver Todos os Imóveis</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentProperties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum imóvel cadastrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando seu primeiro imóvel
                </p>
                <Button asChild>
                  <Link to="/admin/imoveis/novo">+ Criar Primeiro Imóvel</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                        Imóvel
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                        Tipo
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                        Cidade
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                        Preço
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                        Criado
                      </th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProperties.map((property) => {
                      const statusInfo = getStatusBadge(property.status);
                      return (
                        <tr key={property.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="flex items-center">
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-12 h-12 rounded object-cover mr-3"
                              />
                              <span className="font-medium">{property.title}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">{getTypeBadge(property.type)}</Badge>
                          </td>
                          <td className="p-3 text-sm">{property.city}</td>
                          <td className="p-3 text-sm font-medium">
                            {formatPrice(property.price, property.type)}
                          </td>
                          <td className="p-3">
                            <Badge variant={statusInfo.variant}>
                              {statusInfo.label}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {formatDate(property.id)}
                          </td>
                          <td className="p-3">
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
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title="Editar"
                              >
                                <Link to={`/admin/imoveis/${property.id}/editar`}>
                                  <Pencil className="w-4 h-4" />
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Deletar"
                                  >
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
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
