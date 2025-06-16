
import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quotation, Supplier } from '@/types/quotation';
import { Product } from '@/types/product';

interface QuotationFormProps {
  quotation: Quotation | null;
  onSubmit: (data: Omit<Quotation, 'id'>) => void;
  onClose: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const QuotationForm = ({ quotation, onSubmit, onClose, products, setProducts }: QuotationFormProps) => {
  const [formData, setFormData] = useState({
    clientName: quotation?.clientName || '',
    deviceModel: quotation?.deviceModel || '',
    partType: quotation?.partType || '',
    requestDate: quotation?.requestDate || new Date().toISOString().split('T')[0],
    status: quotation?.status || 'Em aberto' as const,
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(
    quotation?.suppliers || []
  );

  const addSupplier = () => {
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: '',
      quotedPrice: 0,
      deliveryTime: '',
      observations: '',
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const updateSupplier = (id: string, field: keyof Supplier, value: string | number) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, [field]: value } : supplier
    ));
  };

  const removeSupplier = (id: string) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      suppliers,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {quotation ? 'Editar Cotação' : 'Nova Cotação'}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              <Label htmlFor="deviceModel">Modelo do Aparelho</Label>
              <Input
                id="deviceModel"
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="partType">Tipo de Peça</Label>
              <Input
                id="partType"
                value={formData.partType}
                onChange={(e) => setFormData({ ...formData, partType: e.target.value })}
                placeholder="ex: display, placa, conector"
                required
              />
            </div>

            <div>
              <Label htmlFor="requestDate">Data da Solicitação</Label>
              <Input
                id="requestDate"
                type="date"
                value={formData.requestDate}
                onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em aberto">Em aberto</SelectItem>
                  <SelectItem value="Aguardando cliente">Aguardando cliente</SelectItem>
                  <SelectItem value="Peça adquirida">Peça adquirida</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fornecedores (até 3)</CardTitle>
              {suppliers.length < 3 && (
                <Button type="button" variant="outline" onClick={addSupplier}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Fornecedor
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {suppliers.map((supplier, index) => (
                <div key={supplier.id} className="border p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Fornecedor {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSupplier(supplier.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome do Fornecedor</Label>
                      <Input
                        value={supplier.name}
                        onChange={(e) => updateSupplier(supplier.id, 'name', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label>Valor Cotado (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={supplier.quotedPrice}
                        onChange={(e) => updateSupplier(supplier.id, 'quotedPrice', parseFloat(e.target.value))}
                        required
                      />
                    </div>

                    <div>
                      <Label>Prazo de Entrega</Label>
                      <Input
                        value={supplier.deliveryTime}
                        onChange={(e) => updateSupplier(supplier.id, 'deliveryTime', e.target.value)}
                        placeholder="ex: 5 dias úteis"
                      />
                    </div>

                    <div>
                      <Label>Observações</Label>
                      <Textarea
                        value={supplier.observations}
                        onChange={(e) => updateSupplier(supplier.id, 'observations', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {quotation ? 'Atualizar' : 'Salvar'} Cotação
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotationForm;
