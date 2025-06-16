import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import Dashboard from '@/components/Dashboard';
import ProductTable from '@/components/ProductTable';
import ProductForm from '@/components/ProductForm';
import QuotationTab from '@/components/QuotationTab';
import StockOutTab from '@/components/StockOutTab';
import BudgetTab from '@/components/BudgetTab';
import SalesReceiptTab from '@/components/SalesReceiptTab';
import { Product } from '@/types/product';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Carregar produtos do localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('inventory-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Salvar produtos no localStorage
  useEffect(() => {
    localStorage.setItem('inventory-products', JSON.stringify(products));
  }, [products]);

  // Verificar alertas de estoque baixo
  useEffect(() => {
    const lowStockProducts = products.filter(product => product.quantity <= 5);
    lowStockProducts.forEach(product => {
      toast({
        title: "Alerta de Estoque Baixo",
        description: `${product.name} está com apenas ${product.quantity} unidades em estoque!`,
        variant: "destructive",
      });
    });
  }, [products]);

  const handleAddProduct = (productData: Omit<Product, 'id' | 'entryDate' | 'profitMargin' | 'daysInStock'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      entryDate: new Date().toISOString(),
      profitMargin: ((productData.salePrice - productData.costPrice) / productData.costPrice) * 100,
      daysInStock: 0
    };

    setProducts(prev => [...prev, newProduct]);
    setIsFormOpen(false);
    toast({
      title: "Produto Adicionado",
      description: `${newProduct.name} foi adicionado ao estoque com sucesso!`,
    });
  };

  const handleEditProduct = (productData: Omit<Product, 'id' | 'entryDate' | 'profitMargin' | 'daysInStock'>) => {
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      ...productData,
      profitMargin: ((productData.salePrice - productData.costPrice) / productData.costPrice) * 100,
      daysInStock: Math.floor((new Date().getTime() - new Date(editingProduct.entryDate).getTime()) / (1000 * 60 * 60 * 24))
    };

    setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setIsFormOpen(false);
    toast({
      title: "Produto Atualizado",
      description: `${updatedProduct.name} foi atualizado com sucesso!`,
    });
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Produto Removido",
      description: `${product?.name} foi removido do estoque.`,
    });
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Controle de Estoque</h1>
            <p className="text-gray-600 mt-2">Gerencie seus produtos de forma eficiente</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="estoque" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
            <TabsTrigger value="cotacao">Cotação de Peças</TabsTrigger>
            <TabsTrigger value="saida">Saída de Estoque</TabsTrigger>
            <TabsTrigger value="orcamento">Orçamentos</TabsTrigger>
            <TabsTrigger value="comprovante">Comprovante de Venda</TabsTrigger>
          </TabsList>

          {/* Estoque Tab */}
          <TabsContent value="estoque">
            <div className="flex justify-end mb-6">
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            <Dashboard products={products} />

            <ProductTable 
              products={products}
              onEdit={openEditForm}
              onDelete={handleDeleteProduct}
            />

            {isFormOpen && (
              <ProductForm
                product={editingProduct}
                onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
                onClose={closeForm}
              />
            )}
          </TabsContent>

          {/* Cotação Tab */}
          <TabsContent value="cotacao">
            <QuotationTab products={products} setProducts={setProducts} />
          </TabsContent>

          {/* Saída Tab */}
          <TabsContent value="saida">
            <StockOutTab products={products} setProducts={setProducts} />
          </TabsContent>

          {/* Orçamento Tab */}
          <TabsContent value="orcamento">
            <BudgetTab products={products} />
          </TabsContent>

          {/* Comprovante Tab */}
          <TabsContent value="comprovante">
            <SalesReceiptTab products={products} setProducts={setProducts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
