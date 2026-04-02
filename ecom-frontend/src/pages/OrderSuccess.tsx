import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center min-h-[60vh]">
        <Card className="shadow-card max-w-md w-full">
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-4">📋</p>
            <h2 className="text-xl font-bold mb-2">No order data</h2>
            <Link to="/shop"><Button className="gradient-bg text-primary-foreground mt-4">Back to Shop</Button></Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center min-h-[60vh]">
      <Card className="shadow-card max-w-lg w-full">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="h-16 w-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="h-8 w-8 text-primary-foreground" />
          </motion.div>

          <h1 className="text-2xl font-bold mb-1">Order Placed!</h1>
          <p className="text-muted-foreground text-sm mb-6">Your order has been confirmed and is being processed.</p>

          <div className="bg-muted/30 rounded-lg p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-bold">#{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge className="bg-success/10 text-success border-success/20" variant="outline">{order.status}</Badge>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono font-bold gradient-text text-lg">₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="border-t pt-2 mt-2 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items</p>
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product #{item.productId} × {item.quantity}</span>
                    <span className="font-mono">₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <Link to="/shop">
              <Button className="gradient-bg text-primary-foreground">
                <ShoppingBag className="h-4 w-4 mr-2" />Continue Shopping
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline">
                View Cart <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderSuccess;
