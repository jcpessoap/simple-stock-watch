
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Omit<Product, 'id' | 'entryDate' | 'profitMargin' | 'daysInStock'>) => void;
  onClose: () => void;
}

const ProductForm = ({ product, onSubmit, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Diversos' as Product['category'],
    costPrice: 0,
    salePrice: 0,
    quantity: 0
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        costPrice: product.costPrice,
        salePrice: product.salePrice,
        quantity: product.quantity
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }

    if (formData.costPrice <= 0 || formData.salePrice <= 0) {
      alert('Valores devem ser maiores que zero');
      return;
    }

    if (formData.quantity < 0) {
      alert('Quantidade não pode ser negativa');
      return;
    }

    onSubmit(formData);
  };

  const profitMargin = formData.costPrice > 0 
    ? ((formData.salePrice - formData.costPrice) / formData.costPrice) * 100 
    : 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Produto' : 'Adicionar Produto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome do produto"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: Product['category']) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Carregadores">Carregadores</SelectItem>
                <SelectItem value="Cabos USB">Cabos USB</SelectItem>
                <SelectItem value="Capinhas">Capinhas</SelectItem>
                <SelectItem value="Películas">Películas</SelectItem>
                <SelectItem value="Acessórios">Acessórios</SelectItem>
                <SelectItem value="Diversos">Diversos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costPrice">Valor Pago (R$) *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <Label htmlFor="salePrice">Valor Venda (R$) *</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              placeholder="0"
              required
            />
          </div>

          {formData.costPrice > 0 && formData.salePrice > 0 && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <Label className="text-sm text-gray-600">Margem de Lucro Calculada:</Label>
              <div className={`text-lg font-bold ${profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(2)}%
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              {product ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
