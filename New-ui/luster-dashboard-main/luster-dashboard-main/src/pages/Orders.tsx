import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckCircle, Clock, Truck, Package, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { orders, type Order } from '@/lib/mock-data';

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', class: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  processing: { label: 'Processing', class: 'bg-primary/10 text-primary border-primary/20', icon: Package },
  shipped: { label: 'Shipped', class: 'bg-secondary/10 text-secondary border-secondary/20', icon: Truck },
  delivered: { label: 'Delivered', class: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', class: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
};

const Orders = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div><h1 className="text-2xl md:text-3xl font-bold">Orders</h1><p className="text-muted-foreground text-sm mt-1">Track and manage customer orders</p></div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left p-3 font-medium">Order ID</th>
              <th className="text-left p-3 font-medium">Customer</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Date</th>
              <th className="text-left p-3 font-medium">Total</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(o => {
                const sc = statusConfig[o.status];
                return (
                  <tr key={o.id} className="border-b hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedOrder(o)}>
                    <td className="p-3 font-mono font-semibold">{o.id}</td>
                    <td className="p-3"><div className="font-medium">{o.customer.name}</div><div className="text-xs text-muted-foreground">{o.customer.email}</div></td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{new Date(o.date).toLocaleDateString()}</td>
                    <td className="p-3 font-mono font-semibold">${o.total.toFixed(2)}</td>
                    <td className="p-3"><Badge variant="outline" className={sc.class}><sc.icon className="h-3 w-3 mr-1" />{sc.label}</Badge></td>
                    <td className="p-3 text-right"><Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}>View</Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader><SheetTitle>Order {selectedOrder.id}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Status</h4>
                  <div className="flex gap-2 flex-wrap">
                    {['pending', 'processing', 'shipped', 'delivered'].map((s, i) => {
                      const isCurrent = s === selectedOrder.status;
                      const isPast = ['pending', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status) >= i;
                      return (
                        <Badge key={s} variant="outline" className={isPast ? statusConfig[s].class : 'opacity-40'}>
                          {statusConfig[s].label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">👤 Customer</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>{selectedOrder.customer.name}</p>
                    <p>{selectedOrder.customer.email}</p>
                    <p>{selectedOrder.customer.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">📍 Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">🛍️ Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((itm, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-muted/30 text-sm">
                        <div><p className="font-medium">{itm.name}</p><p className="text-xs text-muted-foreground">SKU: {itm.sku} · Qty: {itm.qty}</p></div>
                        <span className="font-mono font-semibold">${(itm.price * itm.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-2">💰 Payment Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">${(selectedOrder.total * 0.85).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-mono">$15.00</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="font-mono">${(selectedOrder.total * 0.08).toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold pt-2 border-t mt-2"><span>Total</span><span className="font-mono">${selectedOrder.total.toFixed(2)}</span></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">💳 {selectedOrder.payment.method}{selectedOrder.payment.last4 ? ` ****${selectedOrder.payment.last4}` : ''} · <span className="text-success">{selectedOrder.payment.status === 'paid' ? '✅ Paid' : '⏳ Pending'}</span></p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default Orders;
