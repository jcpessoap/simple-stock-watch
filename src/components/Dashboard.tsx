
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

interface DashboardProps {
  products: Product[];
}

const Dashboard = ({ products }: DashboardProps) => {
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockProducts = products.filter(product => product.quantity <= 5).length;
  const oldStockProducts = products.filter(product => {
    const daysInStock = Math.floor((new Date().getTime() - new Date(product.entryDate).getTime()) / (1000 * 60 * 60 * 24));
    return daysInStock > 90;
  }).length;

  const averageProfitMargin = products.length > 0 
    ? products.reduce((sum, product) => sum + product.profitMargin, 0) / products.length 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            {totalQuantity} unidades no estoque
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{lowStockProducts}</div>
          <p className="text-xs text-muted-foreground">
            Produtos com ≤ 5 unidades
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {averageProfitMargin.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Margem de lucro média
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estoque Parado</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{oldStockProducts}</div>
          <p className="text-xs text-muted-foreground">
            Produtos há mais de 90 dias
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
