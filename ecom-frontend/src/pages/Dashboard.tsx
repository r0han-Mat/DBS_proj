import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Package, Users, ShoppingCart, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getProducts, getUsers, getCart } from '@/api/apiService';
import { useCart } from '@/context/CartContext';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { activeUserId, activeUserName, cartCount } = useCart();

  useEffect(() => {
    getProducts().then((data) => { setProducts(data); setProductCount(data.length); }).catch(() => {});
    getUsers().then((data) => { setUsers(data); setUserCount(data.length); }).catch(() => {});
    if (activeUserId) {
      getCart(activeUserId).then((data) => setCartItems(Array.isArray(data) ? data : [])).catch(() => {});
    }
  }, [activeUserId]);

  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);
  const lowStock = products.filter(p => p.stockQuantity < 10).length;

  const metrics = [
    { label: 'Products', value: productCount, sub: `${lowStock} low stock`, icon: Package, color: 'from-primary to-secondary' },
    { label: 'Users', value: userCount, sub: 'Registered customers', icon: Users, color: 'from-secondary to-success' },
    { label: 'Cart Items', value: cartCount, sub: activeUserName ? `as ${activeUserName}` : 'No user selected', icon: ShoppingCart, color: 'from-warning to-destructive' },
    { label: 'Catalog Value', value: `₹${totalValue.toLocaleString('en-IN')}`, sub: 'Total product value', icon: DollarSign, color: 'from-success to-secondary' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {activeUserName ? `Welcome back, ${activeUserName}!` : 'Welcome! Select a user to get started.'}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <motion.div key={m.label} variants={item}>
            <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 gradient-border overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{m.label}</p>
                    <p className="text-2xl md:text-3xl font-bold font-mono animate-count-up">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.sub}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0`}>
                    <m.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-lg">⚡ Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link to="/shop"><Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-1.5 text-xs hover:bg-primary/5 hover:border-primary/30"><Package className="h-4 w-4" />Browse Shop</Button></Link>
              <Link to="/admin"><Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-1.5 text-xs hover:bg-primary/5 hover:border-primary/30"><TrendingUp className="h-4 w-4" />Manage Products</Button></Link>
              <Link to="/users"><Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-1.5 text-xs hover:bg-primary/5 hover:border-primary/30"><Users className="h-4 w-4" />Manage Users</Button></Link>
              <Link to="/cart"><Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-1.5 text-xs hover:bg-primary/5 hover:border-primary/30"><ShoppingCart className="h-4 w-4" />View Cart</Button></Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Products */}
        <motion.div variants={item}>
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">📦 Recent Products</CardTitle>
              <Link to="/shop">
                <Button variant="ghost" size="sm" className="text-primary text-xs">View All <ArrowUpRight className="h-3 w-3 ml-1" /></Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {products.slice(0, 4).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{p.name}</span>
                      <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Stock: {p.stockQuantity}</p>
                  </div>
                  <span className="font-mono font-semibold text-sm ml-4">₹{Number(p.price).toLocaleString('en-IN')}</span>
                </div>
              ))}
              {products.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No products yet. Add some!</p>}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
