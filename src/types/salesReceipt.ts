
export interface SalesReceipt {
  id: string;
  clientName: string;
  items: SalesItem[];
  totalValue: number;
  paymentMethod: 'Dinheiro' | 'Cartão de débito' | 'Cartão de crédito' | 'Pix';
  saleDate: string;
}

export interface SalesItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
