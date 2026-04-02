import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '@/context/CartContext';
import { getUsers, createUser } from '@/api/apiService';
import { toast } from 'sonner';

const Users = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { activeUserId, setActiveUser } = useCart();

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      firstName: fd.get('firstName') as string,
      lastName: fd.get('lastName') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
    };
    const city = fd.get('city') as string;
    const country = fd.get('country') as string;
    if (city || country) {
      payload.address = { street: fd.get('street') as string, city, state: fd.get('state') as string, zipcode: fd.get('zipcode') as string, country };
    }
    try {
      await createUser(payload);
      toast.success('User created!');
      setModalOpen(false);
      await loadUsers();
    } catch {
      toast.error('Failed to create user');
    }
  };

  const handleSelect = (user: any) => {
    setActiveUser(user.id, `${user.firstName} ${user.lastName}`);
    toast.success(`Now shopping as ${user.firstName}!`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage users and choose who you're shopping as</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gradient-bg text-primary-foreground">
          <UserPlus className="h-4 w-4 mr-2" />Add User
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <Card className="shadow-card"><div className="p-8 text-center text-muted-foreground">Loading users...</div></Card>
      ) : (
        <Card className="shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium">User</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Email</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Location</th>
                <th className="text-left p-3 font-medium">Role</th>
                <th className="text-right p-3 font-medium">Action</th>
              </tr></thead>
              <tbody>
                {filtered.map(u => {
                  const isActive = String(u.id) === String(activeUserId);
                  return (
                    <tr key={u.id} className={`border-b hover:bg-muted/20 transition-colors ${isActive ? 'bg-primary/5' : ''}`}>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0 ${isActive ? 'gradient-bg' : 'bg-muted'}`}>
                            {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium">{u.firstName} {u.lastName}</span>
                            {isActive && <Badge className="ml-2 bg-success/10 text-success border-success/20" variant="outline">Active</Badge>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{u.email}</td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell">
                        {u.address?.city ? `${u.address.city}, ${u.address.country}` : '—'}
                      </td>
                      <td className="p-3"><Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{u.role}</Badge></td>
                      <td className="p-3 text-right">
                        {isActive ? (
                          <span className="text-success text-sm font-medium flex items-center justify-end gap-1"><Check className="h-3 w-3" />Shopping</span>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleSelect(u)}>Shop as</Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>First Name *</Label><Input name="firstName" required /></div>
              <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required /></div>
              <div className="space-y-2"><Label>Phone</Label><Input name="phone" /></div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">Address (optional)</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Street</Label><Input name="street" /></div>
              <div className="space-y-2"><Label>City</Label><Input name="city" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>State</Label><Input name="state" /></div>
              <div className="space-y-2"><Label>Zip</Label><Input name="zipcode" /></div>
              <div className="space-y-2"><Label>Country</Label><Input name="country" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="gradient-bg text-primary-foreground">Create User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Users;
