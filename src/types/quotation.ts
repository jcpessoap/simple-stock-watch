
export interface Quotation {
  id: string;
  clientName: string;
  deviceModel: string;
  partType: string;
  requestDate: string;
  status: 'Em aberto' | 'Aguardando cliente' | 'Peça adquirida' | 'Cancelada';
  suppliers: Supplier[];
}

export interface Supplier {
  id: string;
  name: string;
  quotedPrice: number;
  deliveryTime: string;
  observations: string;
}
