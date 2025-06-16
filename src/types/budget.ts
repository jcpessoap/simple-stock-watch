
export interface Budget {
  id: string;
  clientName: string;
  contact: string;
  items: BudgetItem[];
  totalValue: number;
  validUntil: string;
  status: 'Pendente' | 'Aprovado' | 'Recusado';
  createdAt: string;
}

export interface BudgetItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
