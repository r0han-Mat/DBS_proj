import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { customers } from '@/lib/mock-data';

const tierColors: Record<string, string> = {
  VIP: 'bg-primary/10 text-primary border-primary/20',
  Regular: 'bg-secondary/10 text-secondary border-secondary/20',
  New: 'bg-success/10 text-success border-success/20',
};

const Customers = () => {
  const [search, setSearch] = useState('');
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div><h1 className="text-2xl md:text-3xl font-bold">Customers</h1><p className="text-muted-foreground text-sm mt-1">Manage your customer base</p></div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left p-3 font-medium">Customer</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Email</th>
              <th className="text-left p-3 font-medium">Orders</th>
              <th className="text-left p-3 font-medium">Spent</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell">Joined</th>
              <th className="text-left p-3 font-medium">Tier</th>
            </tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b hover:bg-muted/20 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">{c.avatar}</div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{c.email}</td>
                  <td className="p-3 font-mono">{c.orders}</td>
                  <td className="p-3 font-mono font-semibold">${c.spent.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{c.joined}</td>
                  <td className="p-3"><Badge variant="outline" className={tierColors[c.tier]}>{c.tier}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default Customers;
