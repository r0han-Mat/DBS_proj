import { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts, searchProducts } from '../api/apiService';
import '../App.css';

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`toast ${type}`}>{msg}</div>;
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = keyword.trim()
        ? await searchProducts(keyword.trim())
        : await getProducts();
      setProducts(data);
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const skeletons = Array.from({ length: 8 });

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1>Shop</h1>
          <p>Find the best products at the best prices</p>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍  Search products by name…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button className="btn btn-secondary" onClick={() => setKeyword('')}>
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="product-grid">
            {skeletons.map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton skeleton-line" style={{ width: '70%' }} />
                  <div className="skeleton skeleton-line" style={{ width: '90%' }} />
                  <div className="skeleton skeleton-line" style={{ width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>
              {keyword ? `No products matched "${keyword}"` : 'No products available yet. Add some from the Admin page.'}
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onToast={showToast} />
            ))}
          </div>
        )}
      </div>
      <Toast msg={toast.msg} type={toast.type} />
    </main>
  );
}
