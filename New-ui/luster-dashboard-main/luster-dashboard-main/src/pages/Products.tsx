import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Grid3X3, List, Edit2, Trash2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products as mockProducts, categories, type Product } from '@/lib/mock-data';
import { toast } from 'sonner';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const Products = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>(mockProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filtered = productsList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const price = parseFloat(fd.get('price') as string);
    const stock = parseInt(fd.get('stock') as string);
    const category = fd.get('category') as string;

    if (editingProduct) {
      setProductsList(prev => prev.map(p => p.id === editingProduct.id ? { ...p, name, price, stock, category } : p));
      toast.success('Product updated successfully');
    } else {
      const newProduct: Product = { id: Date.now(), name, price, stock, category, categoryId: 1, sku: `SKU-${Date.now()}`, status: 'active', image: '📦', brand: fd.get('brand') as string || '', description: fd.get('description') as string || '' };
      setProductsList(prev => [newProduct, ...prev]);
      toast.success('Product created successfully');
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: number) => {
    setProductsList(prev => prev.filter(p => p.id !== id));
    toast.success('Product deleted');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your product catalog</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setModalOpen(true); }} className="gradient-bg text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-lg p-1">
          <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className={viewMode === 'grid' ? 'gradient-bg h-8 w-8' : 'h-8 w-8'} onClick={() => setViewMode('grid')}><Grid3X3 className="h-4 w-4" /></Button>
          <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="icon" className={viewMode === 'table' ? 'gradient-bg h-8 w-8' : 'h-8 w-8'} onClick={() => setViewMode('table')}><List className="h-4 w-4" /></Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <motion.div key={p.id} variants={item}>
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted/50 rounded-xl flex items-center justify-center text-5xl mb-3">{p.image}</div>
                  <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-mono font-bold text-lg">${p.price.toFixed(2)}</span>
                    <Badge variant="outline" className={p.stock < 20 ? 'border-warning/30 bg-warning/10 text-warning' : 'border-success/30 bg-success/10 text-success'}>
                      Stock: {p.stock}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => { setEditingProduct(p); setModalOpen(true); }}>
                      <Edit2 className="h-3 w-3 mr-1" />Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium">Category</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Stock</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="p-3 flex items-center gap-3"><span className="text-2xl">{p.image}</span><span className="font-medium">{p.name}</span></td>
                    <td className="p-3 text-muted-foreground">{p.category}</td>
                    <td className="p-3 font-mono font-semibold">${p.price.toFixed(2)}</td>
                    <td className="p-3"><Badge variant="outline" className={p.stock < 20 ? 'border-warning/30 bg-warning/10 text-warning' : ''}>{p.stock}</Badge></td>
                    <td className="p-3"><Badge className={p.status === 'active' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'} variant="outline">{p.status}</Badge></td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => { setEditingProduct(p); setModalOpen(true); }}><Edit2 className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">Product Name *</Label><Input id="name" name="name" defaultValue={editingProduct?.name} required /></div>
            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={editingProduct?.description} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="category">Category *</Label>
                <Select name="category" defaultValue={editingProduct?.category}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label htmlFor="brand">Brand</Label><Input id="brand" name="brand" defaultValue={editingProduct?.brand} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="price">Price *</Label><Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required /></div>
              <div className="space-y-2"><Label htmlFor="stock">Stock *</Label><Input id="stock" name="stock" type="number" defaultValue={editingProduct?.stock} required /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="gradient-bg text-primary-foreground">{editingProduct ? 'Update' : 'Save'} Product</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Products;
