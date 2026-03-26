import { Link, useLocation } from 'react-router-dom';
import '../App.css';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <main className="page">
        <div className="container">
          <div className="success-page">
            <div className="success-card">
              <h1 className="text-2xl font-semibold text-white/90">No order data</h1>
              <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>Back to Shop</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const orderTotal = Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <main className="page">
      <div className="container success-page">
        <div className="success-card">
          <h1 className="text-3xl font-bold text-white tracking-tight">Order Placed</h1>
          <p className="sub">Your order has been confirmed and is being processed.</p>

          <div className="order-details">
            <div className="order-detail-row">
              <span style={{ color: 'var(--text-secondary)' }}>Order ID</span>
              <span style={{ fontWeight: 700 }}>#{order.id}</span>
            </div>
            <div className="order-detail-row">
              <span style={{ color: 'var(--text-secondary)' }}>Status</span>
              <span className="badge badge-success">{order.status}</span>
            </div>
            <div className="order-detail-row">
              <span style={{ color: 'var(--text-secondary)' }}>Total</span>
              <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.1rem' }}>₹{orderTotal}</span>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="order-items-list">
                <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Items
                </p>
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-line">
                    <span>Product #{item.productId} × {item.quantity}</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>
                      ₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary">Continue Shopping</Link>
            <Link to="/cart" className="btn btn-secondary">View Cart</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
