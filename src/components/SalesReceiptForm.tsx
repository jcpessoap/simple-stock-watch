
import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesReceipt, SalesItem } from '@/types/salesReceipt';
import { Product } from '@/types/product';

interface SalesReceiptFormProps {
  products: Product[];
  onSubmit: (data: Omit<SalesReceipt, 'id'>) => void;
  onClose: () => void;
}

const SalesReceiptForm = ({ products, onSubmit, onClose }: SalesReceiptFormProps) => {
  const [formData, setFormData] = useState({
    clientName: '',
    paymentMethod: 'Dinheiro' as const,
    saleDate: new Date().toISOString().split('T')[0],
  });

  const [items, setItems] = useState<SalesItem[]>([]);

  const addItem = () => {
    const newItem: SalesItem = {
      id: Date.now().toString(),
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof SalesItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleProductSelect = (itemId: string, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateItem(itemId, 'productName', product.name);
      updateItem(itemId, 'unitPrice', product.salePrice);
    }
  };

  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      items,
      totalValue,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Nova Venda</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="clientName">Nome do Cliente</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select value={formData.paymentMethod} onValueChange={(value: any) => setFormData({ ...formData, paymentMethod: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Cartão de débito">Cartão de débito</SelectItem>
                  <SelectItem value="Cartão de crédito">Cartão de crédito</SelectItem>
                  <SelectItem value="Pix">Pix</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="saleDate">Data da Venda</Label>
              <Input
                id="saleDate"
                type="date"
                value={formData.saleDate}
                onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                required
              />
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Itens da Venda</CardTitle>
              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </CardHeader>
            <CardContent>
              {items.map((item, index) => (
                <div key={item.id} className="border p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Produto</Label>
                      <Select 
                        value={products.find(p => p.name === item.productName)?.id || ''}
                        onValueChange={(productId) => handleProductSelect(item.id, productId)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} (Estoque: {product.quantity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                        required
                      />
                    </div>

                    <div>
                      <Label>Preço Unitário (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                        required
                      />
                    </div>

                    <div>
                      <Label>Total (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.totalPrice.toFixed(2)}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="text-xl font-bold">
                    Total: R$ {totalValue.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Finalizar Venda
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesReceiptForm;
