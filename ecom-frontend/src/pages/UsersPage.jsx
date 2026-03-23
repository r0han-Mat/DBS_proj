import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getUsers, createUser } from '../api/apiService';
import '../App.css';

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', state: '', zipcode: '', country: '',
};

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`toast ${type}`}>{msg}</div>;
}

// Defined OUTSIDE component to prevent remount on every keystroke
function F({ label, name, type = 'text', form, setForm }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="input"
        type={type}
        placeholder={label}
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
      />
    </div>
  );
}

export default function UsersPage() {
  const { activeUserId, setActiveUser } = useCart();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch { showToast('Failed to load users', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email) { showToast('First name and email are required', 'error'); return; }
    setSubmitting(true);
    try {
      await createUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: (form.street || form.city) ? {
          street: form.street,
          city: form.city,
          state: form.state,
          zipcode: form.zipcode,
          country: form.country,
        } : null,
      });
      setForm(emptyForm);
      await loadUsers();
      showToast('User created!');
    } catch {
      showToast('Failed to create user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectUser = (user) => {
    setActiveUser(user.id, `${user.firstName} ${user.lastName}`);
    showToast(`Now shopping as ${user.firstName}!`);
  };

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1>Users</h1>
          <p>Manage users and choose who you're shopping as</p>
        </div>

        <div className="users-layout">
          {/* Create User Form */}
          <div className="user-form-card">
            <h2>➕ Add User</h2>
            <form className="user-form" onSubmit={handleCreate}>
              <F label="First Name" name="firstName" form={form} setForm={setForm} />
              <F label="Last Name" name="lastName" form={form} setForm={setForm} />
              <F label="Email" name="email" type="email" form={form} setForm={setForm} />
              <F label="Phone" name="phone" form={form} setForm={setForm} />
              <div className="address-section-label">📍 Address (optional)</div>
              <F label="Street" name="street" form={form} setForm={setForm} />
              <F label="City" name="city" form={form} setForm={setForm} />
              <F label="State" name="state" form={form} setForm={setForm} />
              <F label="Zip Code" name="zipcode" form={form} setForm={setForm} />
              <F label="Country" name="country" form={form} setForm={setForm} />
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Creating…' : '+ Create User'}
              </button>
            </form>
          </div>

          {/* Users Table */}
          <div>
            <h2 style={{ marginBottom: 16, fontSize: '1.1rem', fontWeight: 700 }}>
              All Users ({users.length})
            </h2>
            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <h3>No users yet</h3>
                <p>Create a user to start shopping.</p>
              </div>
            ) : (
              <div className="table-wrapper user-card-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isActive = u.id === activeUserId || String(u.id) === String(activeUserId);
                      return (
                        <tr key={u.id} style={isActive ? { background: 'var(--accent-glow)' } : {}}>
                          <td style={{ color: 'var(--text-muted)' }}>#{u.id}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>
                              {u.firstName} {u.lastName}
                              {isActive && (
                                <span className="badge badge-accent" style={{ marginLeft: 8 }}>Active</span>
                              )}
                            </div>
                            {u.address?.city && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                📍 {u.address.city}, {u.address.country}
                              </div>
                            )}
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{u.email}</td>
                          <td><span className="badge badge-accent">{u.role}</span></td>
                          <td>
                            {isActive ? (
                              <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>✓ Shopping as</span>
                            ) : (
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleSelectUser(u)}
                              >
                                Shop as
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
