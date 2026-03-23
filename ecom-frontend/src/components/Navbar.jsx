import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, activeUserName, clearActiveUser } = useCart();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">⚡ EcomStore</Link>

        <div className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            🛍️ Shop
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            🛒 Cart
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            👤 Users
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            ⚙️ Admin
          </NavLink>
        </div>

        <div className="navbar-right">
          {activeUserName ? (
            <div className="user-chip" title="Click to clear user" style={{ cursor: 'pointer' }} onClick={clearActiveUser}>
              <span className="user-dot" />
              {activeUserName}
            </div>
          ) : (
            <Link to="/users" className="btn btn-secondary btn-sm">
              Select User
            </Link>
          )}

          <Link to="/cart" className="cart-btn">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
