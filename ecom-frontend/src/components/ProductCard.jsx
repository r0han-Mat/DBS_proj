import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { addToCart } from '../api/apiService';

export default function ProductCard({ product, onToast }) {
  const { activeUserId, refreshCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!activeUserId) {
      onToast('Please select a user first (Users page)', 'error');
      return;
    }
    setLoading(true);
    try {
      await addToCart(activeUserId, { productId: product.id, quantity: 1 });
      await refreshCart();
      onToast(`"${product.name}" added to cart!`, 'success');
    } catch (e) {
      onToast('Could not add to cart — out of stock or server error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isOutOfStock = product.stockQuantity === 0;

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return url.startsWith('/') ? url : `/${url}`;
  };

  return (
    <div className="card product-card">
      <div className="product-card-image">
        {product.imageUrl ? (
          <img src={getImageUrl(product.imageUrl)} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">
            <span>🛍️</span>
          </div>
        )}
        <span className="product-category-chip">{product.category}</span>
        {isOutOfStock && <span className="out-of-stock-overlay">Out of Stock</span>}
      </div>
      <div className="product-card-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-price">₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
          >
            {loading ? '...' : isOutOfStock ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
        <p className="product-stock">
          {isOutOfStock ? (
            <span style={{ color: 'var(--danger)' }}>Out of stock</span>
          ) : (
            <span style={{ color: 'var(--success)' }}>✓ {product.stockQuantity} in stock</span>
          )}
        </p>
      </div>
    </div>
  );
}
