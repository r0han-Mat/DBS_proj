import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getCart, removeFromCart, createOrder } from '../api/apiService';
import '../App.css';

export default function CartPage() {
  const { activeUserId, activeUserName, refreshCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!activeUserId) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getCart(activeUserId);
      setCartItems(Array.isArray(data) ? data : []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, [activeUserId]);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(activeUserId, productId);
      await loadCart();
      await refreshCart();
    } catch { /* swallow */ }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const order = await createOrder(activeUserId);
      await refreshCart();
      navigate('/order-success', { state: { order } });
    } catch {
      alert('Checkout failed. Make sure your cart is not empty and you are logged in as a user.');
    } finally {
      setCheckingOut(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  if (!activeUserId) {
    return (
      <main className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No user selected</h3>
            <p>Please go to the Users page and click "Shop as" to select a user before viewing your cart.</p>
            <Link to="/users" className="btn btn-primary" style={{ marginTop: 20 }}>Go to Users</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>Shopping as <strong style={{ color: 'var(--accent)' }}>{activeUserName}</strong></p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading cart…</p>
        ) : cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products from the shop page.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Products</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="card" style={{ padding: 0 }}>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-image">
                    {item.product?.imageUrl
                      ? <img src={item.product.imageUrl} alt={item.product.name} />
                      : '🛍️'}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.product?.name}</div>
                    <div className="cart-item-qty">Qty: {item.quantity}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {item.product?.category}
                    </div>
                  </div>
                  <div className="cart-item-price">
                    ₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(item.product?.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="summary-row">
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span>₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <button
                className="btn btn-success checkout-btn"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? '⏳ Processing…' : '✓ Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
