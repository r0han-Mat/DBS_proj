import { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts, searchProducts } from '../api/apiService';
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import GradientMenu from '../components/ui/gradient-menu';
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
    <main className="page" style={{ paddingTop: 0 }}>
      <HeroGeometric 
        badge="ECOM STORE" 
        title1="Elevate Your" 
        title2="Shopping Experience" 
      />
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products by name…"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-8">
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
            <h3 className="text-xl font-medium text-white/80 mb-2">No products found</h3>
            <p className="text-white/40">
              {keyword ? `No products matched "${keyword}"` : 'No products available yet. Add some from the Admin page.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onToast={showToast} />
            ))}
          </div>
        )}
      </div>
      <Toast msg={toast.msg} type={toast.type} />
      <div style={{ padding: '4rem 0', background: '#0d0f14' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#8b92a5' }}>Quick Links</h2>
        <GradientMenu />
      </div>
    </main>
  );
}
