import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { getCart, removeFromCart, createOrder } from '@/api/apiService';
import { toast } from 'sonner';

const Cart = () => {
  const { activeUserId, activeUserName, refreshCart } = useCart();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!activeUserId) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getCart(activeUserId);
      setCartItems(Array.isArray(data) ? data : []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, [activeUserId]);

  const handleRemove = async (productId: number) => {
    try {
      await removeFromCart(activeUserId, productId);
      await loadCart();
      await refreshCart();
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const order = await createOrder(activeUserId);
      await refreshCart();
      navigate('/order-success', { state: { order } });
    } catch {
      toast.error('Checkout failed. Make sure your cart is not empty.');
    } finally {
      setCheckingOut(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  if (!activeUserId) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Cart</h1>
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-4">👤</p>
            <h3 className="text-lg font-semibold mb-2">No user selected</h3>
            <p className="text-muted-foreground text-sm mb-4">Please select a user first to view your cart.</p>
            <Link to="/users"><Button className="gradient-bg text-primary-foreground">Go to Users</Button></Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Cart</h1>
        <p className="text-muted-foreground text-sm mt-1">Shopping as <span className="text-primary font-semibold">{activeUserName}</span></p>
      </div>

      {loading ? (
        <Card className="shadow-card"><CardContent className="p-8 text-center text-muted-foreground">Loading cart...</CardContent></Card>
      ) : cartItems.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-4">🛒</p>
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm mb-4">Add some products from the shop page.</p>
            <Link to="/shop"><Button className="gradient-bg text-primary-foreground">Browse Products</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/30">
                    <th className="text-left p-3 font-medium">Product</th>
                    <th className="text-left p-3 font-medium">Qty</th>
                    <th className="text-left p-3 font-medium">Price</th>
                    <th className="text-right p-3 font-medium">Remove</th>
                  </tr></thead>
                  <tbody>
                    {cartItems.map((item: any) => (
                      <tr key={item.id} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-lg shrink-0">
                              {item.product?.imageUrl ? <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : '📦'}
                            </div>
                            <div>
                              <p className="font-medium">{item.product?.name}</p>
                              <p className="text-xs text-muted-foreground">{item.product?.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3"><Badge variant="outline">{item.quantity}</Badge></td>
                        <td className="p-3 font-mono font-semibold">₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-right">
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleRemove(item.product?.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <Card className="shadow-card h-fit sticky top-24">
            <CardHeader><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate max-w-[180px]">{item.product?.name} × {item.quantity}</span>
                  <span className="font-mono">₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="font-mono gradient-text text-lg">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <Button
                className="w-full gradient-bg text-primary-foreground mt-2"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {checkingOut ? 'Processing...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
