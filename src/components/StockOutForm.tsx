
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockOut } from '@/types/stockOut';
import { Product } from '@/types/product';

interface StockOutFormProps {
  products: Product[];
  onSubmit: (data: Omit<StockOut, 'id'>) => void;
  onClose: () => void;
}

const StockOutForm = ({ products, onSubmit, onClose }: StockOutFormProps) => {
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    quantity: 1,
    reason: 'venda' as const,
    date: new Date().toISOString().split('T')[0],
    responsible: '',
  });

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setFormData({
      ...formData,
      productId,
      productName: product?.name || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Registrar Saída de Estoque</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="product">Produto</Label>
              <Select value={formData.productId} onValueChange={handleProductChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
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
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="reason">Motivo da Saída</Label>
              <Select value={formData.reason} onValueChange={(value: any) => setFormData({ ...formData, reason: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="troca">Troca</SelectItem>
                  <SelectItem value="descarte">Descarte</SelectItem>
                  <SelectItem value="uso interno">Uso Interno</SelectItem>
                  <SelectItem value="devolução">Devolução</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="responsible">Responsável</Label>
              <Input
                id="responsible"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Registrar Saída
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockOutForm;
