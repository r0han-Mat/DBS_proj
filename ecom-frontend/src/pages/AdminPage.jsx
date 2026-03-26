import { useState, useEffect } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/apiService';
import '../App.css';

const emptyForm = { name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: '' };

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`toast ${type}`}>{msg}</div>;
}

function Field({ label, name, type = 'text', step, form, setForm }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="input"
        type={type}
        step={step}
        placeholder={label}
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
      />
    </div>
  );
}

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) { showToast('Name and price are required', 'error'); return; }
    setSubmitting(true);
    try {
      await createProduct({
        ...form,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity) || 0,
      });
      setForm(emptyForm);
      await loadProducts();
      showToast('Product created!');
    } catch {
      showToast('Failed to create product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditRow({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      category: product.category,
      imageUrl: product.imageUrl,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await updateProduct(id, {
        ...editRow,
        price: parseFloat(editRow.price),
        stockQuantity: parseInt(editRow.stockQuantity) || 0,
      });
      setEditingId(null);
      await loadProducts();
      showToast('Product updated!');
    } catch {
      showToast('Failed to update product', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Soft-delete this product? It will no longer appear in the shop.')) return;
    try {
      await deleteProduct(id);
      await loadProducts();
      showToast('Product deleted');
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1>Admin</h1>
          <p>Manage your product catalogue</p>
        </div>

        <div className="admin-layout">
          {/* Add Product Form */}
          <div className="admin-form-card">
            <h2 className="text-lg font-semibold mb-4 text-white/90">Add Product</h2>
            <form className="admin-form" onSubmit={handleCreate}>
              <Field label="Product Name" name="name" form={form} setForm={setForm} />
              <Field label="Description" name="description" form={form} setForm={setForm} />
              <Field label="Price (₹)" name="price" type="number" step="0.01" form={form} setForm={setForm} />
              <Field label="Stock Quantity" name="stockQuantity" type="number" form={form} setForm={setForm} />
              <Field label="Category" name="category" form={form} setForm={setForm} />
              <Field label="Image URL" name="imageUrl" form={form} setForm={setForm} />
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </div>

          {/* Product Table */}
          <div>
            <h2 style={{ marginBottom: 16, fontSize: '1.1rem', fontWeight: 700 }}>
              All Active Products ({products.length})
            </h2>
            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3 className="text-xl font-medium text-white/80 mb-2">No products yet</h3>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) =>
                      editingId === p.id ? (
                        <tr key={p.id} className="edit-row">
                          <td>#{p.id}</td>
                          <td><input value={editRow.name} onChange={(e) => setEditRow((r) => ({ ...r, name: e.target.value }))} /></td>
                          <td><input value={editRow.category} onChange={(e) => setEditRow((r) => ({ ...r, category: e.target.value }))} /></td>
                          <td><input type="number" value={editRow.price} onChange={(e) => setEditRow((r) => ({ ...r, price: e.target.value }))} /></td>
                          <td><input type="number" value={editRow.stockQuantity} onChange={(e) => setEditRow((r) => ({ ...r, stockQuantity: e.target.value }))} /></td>
                          <td style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-success btn-sm" onClick={() => handleUpdate(p.id)}>Save</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={p.id}>
                          <td style={{ color: 'var(--text-muted)' }}>#{p.id}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.description?.slice(0, 40)}</div>
                          </td>
                          <td><span className="badge badge-accent">{p.category}</span></td>
                          <td style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                          <td>
                            <span className={`badge ${p.stockQuantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                              {p.stockQuantity}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => startEdit(p)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)} title="Delete Product">Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} />
    </main>
  );
}
