
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import QuotationForm from './QuotationForm';
import { Quotation } from '@/types/quotation';
import { Product } from '@/types/product';

interface QuotationTabProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const QuotationTab = ({ products, setProducts }: QuotationTabProps) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    const savedQuotations = localStorage.getItem('inventory-quotations');
    if (savedQuotations) {
      setQuotations(JSON.parse(savedQuotations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventory-quotations', JSON.stringify(quotations));
  }, [quotations]);

  const handleAddQuotation = (quotationData: Omit<Quotation, 'id'>) => {
    const newQuotation: Quotation = {
      ...quotationData,
      id: Date.now().toString(),
    };
    setQuotations(prev => [...prev, newQuotation]);
    setIsFormOpen(false);
  };

  const handleEditQuotation = (quotationData: Omit<Quotation, 'id'>) => {
    if (!editingQuotation) return;
    
    const updatedQuotation: Quotation = {
      ...editingQuotation,
      ...quotationData,
    };
    
    setQuotations(prev => prev.map(q => q.id === editingQuotation.id ? updatedQuotation : q));
    setEditingQuotation(null);
    setIsFormOpen(false);
  };

  const handleDeleteQuotation = (id: string) => {
    setQuotations(prev => prev.filter(q => q.id !== id));
  };

  const openEditForm = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingQuotation(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em aberto': return 'bg-yellow-100 text-yellow-800';
      case 'Aguardando cliente': return 'bg-blue-100 text-blue-800';
      case 'Peça adquirida': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cotação de Peças</h2>
        <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Cotação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cotações Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Modelo do Aparelho</TableHead>
                <TableHead>Tipo de Peça</TableHead>
                <TableHead>Data Solicitação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fornecedores</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">{quotation.clientName}</TableCell>
                  <TableCell>{quotation.deviceModel}</TableCell>
                  <TableCell>{quotation.partType}</TableCell>
                  <TableCell>{new Date(quotation.requestDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(quotation.status)}>
                      {quotation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{quotation.suppliers.length}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(quotation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuotation(quotation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isFormOpen && (
        <QuotationForm
          quotation={editingQuotation}
          onSubmit={editingQuotation ? handleEditQuotation : handleAddQuotation}
          onClose={closeForm}
          products={products}
          setProducts={setProducts}
        />
      )}
    </div>
  );
};

export default QuotationTab;
