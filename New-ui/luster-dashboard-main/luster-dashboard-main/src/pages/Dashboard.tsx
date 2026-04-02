import { motion } from 'framer-motion';
import { DollarSign, Package, Tags, Users, TrendingUp, ArrowUpRight, Plus, FileText, Download, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { orders, revenueData } from '@/lib/mock-data';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const metrics = [
  { label: 'Total Revenue', value: '$127,540.89', change: '+12.5%', icon: DollarSign, color: 'from-primary to-secondary' },
  { label: 'Total Orders', value: '3,458', change: '+8.2%', icon: Package, color: 'from-secondary to-success' },
  { label: 'Active Products', value: '1,289', change: '12 out of stock', icon: Tags, color: 'from-warning to-destructive', warning: true },
  { label: 'Active Customers', value: '8,924', change: '+156 new this week', icon: Users, color: 'from-success to-secondary' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  processing: 'bg-primary/10 text-primary border-primary/20',
  shipped: 'bg-secondary/10 text-secondary border-secondary/20',
  delivered: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const Dashboard = () => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your store overview.</p>
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
                    <div className="flex items-center gap-1 text-xs">
                      {m.warning ? (
                        <span className="text-warning flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{m.change}</span>
                      ) : (
                        <span className="text-success flex items-center gap-1"><TrendingUp className="h-3 w-3" />{m.change}</span>
                      )}
                    </div>
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

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Orders */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary text-xs">View All <ArrowUpRight className="h-3 w-3 ml-1" /></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold">{order.id}</span>
                      <Badge variant="outline" className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{order.customer.name} · {order.items.length} items · {order.payment.method}{order.payment.last4 ? ` ****${order.payment.last4}` : ''}</p>
                  </div>
                  <span className="font-mono font-semibold text-sm ml-4">${order.total.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions + Alerts */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-lg">⚡ Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { label: 'Add Product', icon: Plus },
                { label: 'Gen Report', icon: FileText },
                { label: 'Export Data', icon: Download },
                { label: 'Settings', icon: Settings },
              ].map((a) => (
                <Button key={a.label} variant="outline" className="h-auto py-3 flex flex-col items-center gap-1.5 text-xs hover:bg-primary/5 hover:border-primary/30">
                  <a.icon className="h-4 w-4" />{a.label}
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-lg">⚠️ Alerts</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-destructive mt-1.5 shrink-0" />
                <div><p className="font-medium">12 products low on stock</p><p className="text-xs text-muted-foreground">Review Inventory →</p></div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-warning mt-1.5 shrink-0" />
                <div><p className="font-medium">5 pending refund requests</p><p className="text-xs text-muted-foreground">Process Refunds →</p></div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-success mt-1.5 shrink-0" />
                <div><p className="font-medium">Payment gateway updated</p><p className="text-xs text-muted-foreground">View Changes →</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sales Chart */}
      <motion.div variants={item}>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">📈 Sales Overview</CardTitle>
            <div className="flex gap-1">
              {['Week', 'Month', 'Year'].map((t) => (
                <Button key={t} variant={t === 'Week' ? 'default' : 'ghost'} size="sm" className={t === 'Week' ? 'gradient-bg text-primary-foreground text-xs h-7' : 'text-xs h-7'}>
                  {t}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
