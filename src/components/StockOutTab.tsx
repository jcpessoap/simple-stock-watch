
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import StockOutForm from './StockOutForm';
import { StockOut } from '@/types/stockOut';
import { Product } from '@/types/product';
import { toast } from '@/hooks/use-toast';

interface StockOutTabProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const StockOutTab = ({ products, setProducts }: StockOutTabProps) => {
  const [stockOuts, setStockOuts] = useState<StockOut[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const savedStockOuts = localStorage.getItem('inventory-stock-outs');
    if (savedStockOuts) {
      setStockOuts(JSON.parse(savedStockOuts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventory-stock-outs', JSON.stringify(stockOuts));
  }, [stockOuts]);

  const handleAddStockOut = (stockOutData: Omit<StockOut, 'id'>) => {
    const newStockOut: StockOut = {
      ...stockOutData,
      id: Date.now().toString(),
    };

    // Atualizar quantidade do produto
    const updatedProducts = products.map(product => {
      if (product.id === stockOutData.productId) {
        const newQuantity = product.quantity - stockOutData.quantity;
        if (newQuantity < 0) {
          toast({
            title: "Erro",
            description: "Quantidade insuficiente em estoque!",
            variant: "destructive",
          });
          return product;
        }
        return { ...product, quantity: newQuantity };
      }
      return product;
    });

    setProducts(updatedProducts);
    setStockOuts(prev => [...prev, newStockOut]);
    setIsFormOpen(false);

    toast({
      title: "Saída Registrada",
      description: `${stockOutData.quantity} unidades de ${stockOutData.productName} removidas do estoque.`,
    });
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'venda': return 'bg-green-100 text-green-800';
      case 'troca': return 'bg-blue-100 text-blue-800';
      case 'descarte': return 'bg-red-100 text-red-800';
      case 'uso interno': return 'bg-purple-100 text-purple-800';
      case 'devolução': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Saída de Estoque</h2>
        <Button onClick={() => setIsFormOpen(true)} className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Registrar Saída
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Saídas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Responsável</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockOuts.map((stockOut) => (
                <TableRow key={stockOut.id}>
                  <TableCell className="font-medium">{stockOut.productName}</TableCell>
                  <TableCell>{stockOut.quantity}</TableCell>
                  <TableCell>
                    <Badge className={getReasonColor(stockOut.reason)}>
                      {stockOut.reason}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(stockOut.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{stockOut.responsible}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isFormOpen && (
        <StockOutForm
          products={products}
          onSubmit={handleAddStockOut}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default StockOutTab;
