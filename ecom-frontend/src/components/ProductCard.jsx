import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { addToCart } from '../api/apiService';
import { GlowCard } from './ui/spotlight-card';

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

  const colors = ['blue', 'purple', 'green', 'orange', 'red'];
  const glowColor = colors[(product.id || 0) % colors.length];

  return (
    <GlowCard customSize={true} glowColor={glowColor} className="flex flex-col h-full bg-[var(--bg-elevated)] border border-[var(--border)] group">
      <div className="relative w-full aspect-square overflow-hidden bg-black/40 rounded-xl border border-white/5">
        {product.imageUrl ? (
          <img 
            src={getImageUrl(product.imageUrl)} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-sm font-medium tracking-widest uppercase text-white/30 bg-neutral-900 border-2 border-dashed border-white/5">
            No Image
          </div>
        )}
        
        <span className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white/90 uppercase tracking-widest border border-white/10">
            {product.category}
        </span>
        
        {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-white font-black text-lg uppercase tracking-widest border-2 border-white/20 px-5 py-2 rounded-xl bg-black/40">Sold Out</span>
            </div>
        )}
      </div>

      <div className="flex flex-col flex-1 mt-2 justify-between gap-5">
        <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{product.description}</p>
        </div>
        
        <div className="mt-auto flex flex-col gap-4">
            <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                    ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                
                <p className="text-xs font-medium tracking-wide">
                  {isOutOfStock ? (
                      <span className="text-neutral-500">Out of stock</span>
                  ) : (
                      <span className="text-neutral-400">{product.stockQuantity} remaining</span>
                  )}
                </p>
            </div>
            
            <button
              className={`w-full py-3 rounded-xl font-bold tracking-wide transition-all duration-300 ${
                  isOutOfStock 
                    ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10' 
                    : 'bg-white text-black hover:bg-neutral-200 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]'
              }`}
              onClick={handleAddToCart}
              disabled={loading || isOutOfStock}
            >
              {loading ? 'Adding...' : isOutOfStock ? 'Sold Out' : '+ Add to Cart'}
            </button>
        </div>
      </div>
    </GlowCard>
  );
}
