
import { useState } from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // Calcular dias em estoque para cada produto
  const productsWithDays = products.map(product => ({
    ...product,
    daysInStock: Math.floor((new Date().getTime() - new Date(product.entryDate).getTime()) / (1000 * 60 * 60 * 24))
  }));

  // Filtrar produtos
  const filteredProducts = productsWithDays.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = product.quantity <= 5;
    } else if (stockFilter === 'old') {
      matchesStock = product.daysInStock > 90;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity <= 5) {
      return <Badge variant="destructive">Baixo</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800">Normal</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos em Estoque</CardTitle>
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="Carregadores">Carregadores</SelectItem>
              <SelectItem value="Cabos USB">Cabos USB</SelectItem>
              <SelectItem value="Capinhas">Capinhas</SelectItem>
              <SelectItem value="Películas">Películas</SelectItem>
              <SelectItem value="Acessórios">Acessórios</SelectItem>
              <SelectItem value="Diversos">Diversos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os produtos</SelectItem>
              <SelectItem value="low">Estoque baixo</SelectItem>
              <SelectItem value="old">Estoque parado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Produto</th>
                <th className="text-left p-4 font-medium">Categoria</th>
                <th className="text-left p-4 font-medium">Valor Pago</th>
                <th className="text-left p-4 font-medium">Valor Venda</th>
                <th className="text-left p-4 font-medium">Margem %</th>
                <th className="text-left p-4 font-medium">Quantidade</th>
                <th className="text-left p-4 font-medium">Dias Estoque</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">
                    <Badge variant="outline">{product.category}</Badge>
                  </td>
                  <td className="p-4">{formatCurrency(product.costPrice)}</td>
                  <td className="p-4">{formatCurrency(product.salePrice)}</td>
                  <td className="p-4">
                    <span className={`font-medium ${product.profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.profitMargin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-4">{product.quantity}</td>
                  <td className="p-4">
                    <span className={product.daysInStock > 90 ? 'text-orange-600 font-medium' : ''}>
                      {product.daysInStock} dias
                    </span>
                  </td>
                  <td className="p-4">{getStockStatus(product.quantity)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum produto encontrado com os filtros aplicados.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductTable;
