
import { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import SalesReceiptForm from './SalesReceiptForm';
import { SalesReceipt } from '@/types/salesReceipt';
import { Product } from '@/types/product';

interface SalesReceiptTabProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const SalesReceiptTab = ({ products, setProducts }: SalesReceiptTabProps) => {
  const [receipts, setReceipts] = useState<SalesReceipt[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const savedReceipts = localStorage.getItem('inventory-sales-receipts');
    if (savedReceipts) {
      setReceipts(JSON.parse(savedReceipts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventory-sales-receipts', JSON.stringify(receipts));
  }, [receipts]);

  const handleAddReceipt = (receiptData: Omit<SalesReceipt, 'id'>) => {
    const newReceipt: SalesReceipt = {
      ...receiptData,
      id: Date.now().toString(),
    };

    // Atualizar estoque dos produtos vendidos
    const updatedProducts = products.map(product => {
      const soldItem = receiptData.items.find(item => item.productName === product.name);
      if (soldItem) {
        return { ...product, quantity: product.quantity - soldItem.quantity };
      }
      return product;
    });

    setProducts(updatedProducts);
    setReceipts(prev => [...prev, newReceipt]);
    setIsFormOpen(false);
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'Dinheiro': return 'bg-green-100 text-green-800';
      case 'Cartão de débito': return 'bg-blue-100 text-blue-800';
      case 'Cartão de crédito': return 'bg-purple-100 text-purple-800';
      case 'Pix': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Comprovante de Venda</h2>
        <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>Data da Venda</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.clientName}</TableCell>
                  <TableCell>R$ {receipt.totalValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getPaymentMethodColor(receipt.paymentMethod)}>
                      {receipt.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(receipt.saleDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{receipt.items.length} item(s)</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isFormOpen && (
        <SalesReceiptForm
          products={products}
          onSubmit={handleAddReceipt}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default SalesReceiptTab;
