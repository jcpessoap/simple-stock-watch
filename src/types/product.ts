
export interface Product {
  id: string;
  name: string;
  category: 'Carregadores' | 'Cabos USB' | 'Capinhas' | 'Películas' | 'Acessórios' | 'Diversos';
  costPrice: number;
  salePrice: number;
  profitMargin: number;
  entryDate: string;
  quantity: number;
  daysInStock: number;
}
