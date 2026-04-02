import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { transactions } from '@/lib/mock-data';

const statusColors: Record<string, string> = {
  success: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

const summaryCards = [
  { label: 'Total Revenue', value: '$12,458.67', sub: '+23% vs yesterday', color: 'from-primary to-secondary' },
  { label: 'Successful', value: '127 payments', sub: '97.7% success rate', color: 'from-success to-secondary' },
  { label: 'Failed', value: '3 payments', sub: 'Review needed', color: 'from-destructive to-warning' },
];

const Payments = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div><h1 className="text-2xl md:text-3xl font-bold">Payments</h1><p className="text-muted-foreground text-sm mt-1">Payment transactions overview</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map(s => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold font-mono mt-1">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left p-3 font-medium">Transaction</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Order</th>
              <th className="text-left p-3 font-medium">Customer</th>
              <th className="text-left p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell">Method</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium hidden sm:table-cell">Time</th>
            </tr></thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-b hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-mono text-xs">{t.id}</td>
                  <td className="p-3 font-mono text-xs hidden md:table-cell">{t.orderId}</td>
                  <td className="p-3">{t.customer}</td>
                  <td className="p-3 font-mono font-semibold">${t.amount.toFixed(2)}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{t.method}{t.last4 ? ` ****${t.last4}` : ''}</td>
                  <td className="p-3"><Badge variant="outline" className={statusColors[t.status]}>{t.status}</Badge></td>
                  <td className="p-3 text-muted-foreground text-right hidden sm:table-cell">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default Payments;
