
export interface StockOut {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  reason: 'venda' | 'troca' | 'descarte' | 'uso interno' | 'devolução';
  date: string;
  responsible: string;
}
