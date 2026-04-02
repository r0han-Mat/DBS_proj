import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const SettingsPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div><h1 className="text-2xl md:text-3xl font-bold">Settings</h1><p className="text-muted-foreground text-sm mt-1">Configure your store</p></div>

      <Tabs defaultValue="general">
        <TabsList className="bg-muted/50 mb-6">
          {['General', 'Payment', 'Shipping', 'Notifications', 'Security'].map(t => (
            <TabsTrigger key={t} value={t.toLowerCase()} className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">{t}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <Card className="shadow-card">
            <CardHeader><CardTitle>Store Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Store Name</Label><Input defaultValue="ShopAdmin Pro" /></div>
                <div className="space-y-2"><Label>Store Email</Label><Input defaultValue="support@shopadmin.com" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+1 (555) 123-4567" /></div>
                <div className="space-y-2"><Label>Currency</Label>
                  <Select defaultValue="usd"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="usd">USD - US Dollar</SelectItem><SelectItem value="eur">EUR - Euro</SelectItem><SelectItem value="gbp">GBP - British Pound</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4"><Button variant="outline">Cancel</Button><Button className="gradient-bg text-primary-foreground" onClick={() => toast.success('Settings saved!')}>Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="shadow-card"><CardHeader><CardTitle>Payment Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30"><div><p className="font-medium">Stripe</p><p className="text-sm text-muted-foreground">Accept credit card payments</p></div><Switch defaultChecked /></div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30"><div><p className="font-medium">PayPal</p><p className="text-sm text-muted-foreground">Enable PayPal checkout</p></div><Switch defaultChecked /></div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30"><div><p className="font-medium">Apple Pay</p><p className="text-sm text-muted-foreground">Enable Apple Pay</p></div><Switch /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card className="shadow-card"><CardHeader><CardTitle>Shipping Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Free Shipping Threshold</Label><Input defaultValue="50.00" type="number" /></div>
                <div className="space-y-2"><Label>Standard Rate</Label><Input defaultValue="5.99" type="number" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-card"><CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30"><div><p className="font-medium">New Order Alerts</p><p className="text-sm text-muted-foreground">Email when new order is placed</p></div><Switch defaultChecked /></div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30"><div><p className="font-medium">Low Stock Warnings</p><p className="text-sm text-muted-foreground">Alert when stock drops below threshold</p></div><Switch defaultChecked /></div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30"><div><p className="font-medium">Weekly Reports</p><p className="text-sm text-muted-foreground">Receive weekly analytics digest</p></div><Switch /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-card"><CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30"><div><p className="font-medium">Two-Factor Authentication</p><p className="text-sm text-muted-foreground">Extra security for your account</p></div><Switch /></div>
              <div className="space-y-2"><Label>Change Password</Label><Input type="password" placeholder="Current password" /><Input type="password" placeholder="New password" className="mt-2" /></div>
              <div className="flex justify-end"><Button className="gradient-bg text-primary-foreground" onClick={() => toast.success('Password updated!')}>Update Password</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;
