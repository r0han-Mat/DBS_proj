import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { getProducts, searchProducts, addToCart } from '@/api/apiService';
import { toast } from 'sonner';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const Shop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const { activeUserId, refreshCart } = useCart();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = keyword.trim()
        ? await searchProducts(keyword.trim())
        : await getProducts();
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const handleAddToCart = async (product: any) => {
    if (!activeUserId) {
      toast.error('Please select a user first (Users page)');
      return;
    }
    try {
      await addToCart(activeUserId, { productId: product.id, quantity: 1 });
      await refreshCart();
      toast.success(`"${product.name}" added to cart!`);
    } catch {
      toast.error('Could not add to cart — out of stock or server error');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Shop</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse and add products to your cart</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="shadow-card overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted/50 rounded-xl skeleton-shimmer mb-3" />
                <div className="h-4 bg-muted/50 rounded skeleton-shimmer mb-2 w-3/4" />
                <div className="h-3 bg-muted/50 rounded skeleton-shimmer w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <p className="text-3xl mb-3">🔍</p>
            <h3 className="text-lg font-semibold">No products found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {keyword ? `No products matched "${keyword}"` : 'No products available yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p: any) => {
            const isOutOfStock = p.stockQuantity === 0;
            return (
              <motion.div key={p.id} variants={item}>
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group overflow-hidden gradient-border">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted/50 rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-5xl">📦</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">{p.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-mono font-bold text-lg">₹{Number(p.price).toLocaleString('en-IN')}</span>
                      <Badge
                        variant="outline"
                        className={isOutOfStock ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-success/30 bg-success/10 text-success'}
                      >
                        {isOutOfStock ? 'Out of stock' : `${p.stockQuantity} left`}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className={`w-full mt-3 text-xs ${isOutOfStock ? '' : 'gradient-bg text-primary-foreground'}`}
                      variant={isOutOfStock ? 'outline' : 'default'}
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCart(p)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Shop;
