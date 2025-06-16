
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import BudgetForm from './BudgetForm';
import { Budget } from '@/types/budget';
import { Product } from '@/types/product';

interface BudgetTabProps {
  products: Product[];
}

const BudgetTab = ({ products }: BudgetTabProps) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    const savedBudgets = localStorage.getItem('inventory-budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventory-budgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleAddBudget = (budgetData: Omit<Budget, 'id' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setBudgets(prev => [...prev, newBudget]);
    setIsFormOpen(false);
  };

  const handleEditBudget = (budgetData: Omit<Budget, 'id' | 'createdAt'>) => {
    if (!editingBudget) return;
    
    const updatedBudget: Budget = {
      ...editingBudget,
      ...budgetData,
    };
    
    setBudgets(prev => prev.map(b => b.id === editingBudget.id ? updatedBudget : b));
    setEditingBudget(null);
    setIsFormOpen(false);
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const openEditForm = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Aprovado': return 'bg-green-100 text-green-800';
      case 'Recusado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Orçamentos</h2>
        <Button onClick={() => setIsFormOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orçamentos Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.clientName}</TableCell>
                  <TableCell>{budget.contact}</TableCell>
                  <TableCell>R$ {budget.totalValue.toFixed(2)}</TableCell>
                  <TableCell>{new Date(budget.validUntil).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(budget.status)}>
                      {budget.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(budget.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(budget)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                      >
                        <FileText className="h-4 w-4" />
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
        <BudgetForm
          budget={editingBudget}
          products={products}
          onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default BudgetTab;
