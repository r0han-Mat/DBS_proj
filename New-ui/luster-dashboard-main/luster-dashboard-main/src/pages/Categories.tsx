import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categories as mockCategories, type Category } from '@/lib/mock-data';
import { toast } from 'sonner';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } };

const Categories = () => {
  const [catList, setCatList] = useState<Category[]>(mockCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const icon = fd.get('icon') as string || '📦';
    if (editing) {
      setCatList(prev => prev.map(c => c.id === editing.id ? { ...c, name, icon } : c));
      toast.success('Category updated');
    } else {
      setCatList(prev => [...prev, { id: Date.now(), name, icon, productCount: 0 }]);
      toast.success('Category created');
    }
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Organize your product catalog</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="gradient-bg text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {catList.map(c => (
          <motion.div key={c.id} variants={item}>
            <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-3">{c.icon}</div>
                <h3 className="font-bold text-lg">{c.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{c.productCount} products</p>
                <div className="flex gap-2 mt-4 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(c); setModalOpen(true); }}><Edit2 className="h-3 w-3 mr-1" />Edit</Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => { setCatList(prev => prev.filter(x => x.id !== c.id)); toast.success('Category deleted'); }}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input name="name" defaultValue={editing?.name} required /></div>
            <div className="space-y-2"><Label>Icon (emoji)</Label><Input name="icon" defaultValue={editing?.icon || '📦'} /></div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" className="gradient-bg text-primary-foreground">Save</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Categories;
