export interface Product {
  id: number;
  name: string;
  category: string;
  categoryId: number;
  price: number;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
  image: string;
  brand: string;
  description: string;
}

export interface Order {
  id: string;
  customer: { name: string; email: string; phone: string; avatar: string };
  date: string;
  items: { name: string; sku: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment: { method: string; last4?: string; status: 'paid' | 'pending' | 'failed' };
  address: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  avatar: string;
  orders: number;
  spent: number;
  joined: string;
  tier: 'VIP' | 'Regular' | 'New';
}

export interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: string;
  last4?: string;
  status: 'success' | 'pending' | 'failed';
  time: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: 1, name: 'Electronics', icon: '📱', productCount: 245 },
  { id: 2, name: 'Fashion', icon: '👕', productCount: 389 },
  { id: 3, name: 'Home & Garden', icon: '🏠', productCount: 156 },
  { id: 4, name: 'Sports', icon: '⚽', productCount: 127 },
  { id: 5, name: 'Books', icon: '📚', productCount: 94 },
  { id: 6, name: 'Gaming', icon: '🎮', productCount: 203 },
];

export const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', categoryId: 1, price: 99.99, stock: 45, sku: 'WH-001', status: 'active', image: '🎧', brand: 'AudioPro', description: 'Premium wireless headphones with noise cancellation' },
  { id: 2, name: 'Running Shoes', category: 'Sports', categoryId: 4, price: 129.99, stock: 12, sku: 'RS-042', status: 'active', image: '👟', brand: 'SpeedFit', description: 'Lightweight running shoes for professional athletes' },
  { id: 3, name: 'Coffee Maker', category: 'Home & Garden', categoryId: 3, price: 79.99, stock: 156, sku: 'CM-003', status: 'active', image: '☕', brand: 'BrewMaster', description: 'Automatic drip coffee maker with timer' },
  { id: 4, name: 'Smart Watch', category: 'Electronics', categoryId: 1, price: 249.99, stock: 0, sku: 'SW-004', status: 'inactive', image: '⌚', brand: 'TechWear', description: 'Feature-rich smartwatch with health monitoring' },
  { id: 5, name: 'Yoga Mat', category: 'Sports', categoryId: 4, price: 34.99, stock: 89, sku: 'YM-005', status: 'active', image: '🧘', brand: 'FlexFit', description: 'Non-slip yoga mat with alignment lines' },
  { id: 6, name: 'Desk Lamp', category: 'Home & Garden', categoryId: 3, price: 44.99, stock: 67, sku: 'DL-006', status: 'active', image: '💡', brand: 'LightCraft', description: 'LED desk lamp with adjustable brightness' },
  { id: 7, name: 'Gaming Mouse', category: 'Gaming', categoryId: 6, price: 59.99, stock: 8, sku: 'GM-007', status: 'active', image: '🖱️', brand: 'PixelPro', description: 'High-DPI gaming mouse with programmable buttons' },
  { id: 8, name: 'Novel Collection', category: 'Books', categoryId: 5, price: 24.99, stock: 200, sku: 'NC-008', status: 'active', image: '📖', brand: 'ReadMore', description: 'Bestseller fiction collection - 3 books' },
];

export const orders: Order[] = [
  { id: 'ORD-2024-1289', customer: { name: 'John Doe', email: 'john@email.com', phone: '+1 (555) 123-4567', avatar: 'JD' }, date: '2024-01-15T14:45:00', items: [{ name: 'Wireless Headphones', sku: 'WH-001', qty: 1, price: 99.99 }, { name: 'Phone Case - Blue', sku: 'PC-042', qty: 2, price: 29.99 }], total: 234.99, status: 'processing', payment: { method: 'Visa', last4: '4242', status: 'paid' }, address: '123 Main St, Apt 4B, New York, NY 10001' },
  { id: 'ORD-2024-1288', customer: { name: 'Sarah Wilson', email: 'sarah@email.com', phone: '+1 (555) 234-5678', avatar: 'SW' }, date: '2024-01-15T14:30:00', items: [{ name: 'Running Shoes', sku: 'RS-042', qty: 1, price: 89.50 }], total: 89.50, status: 'pending', payment: { method: 'PayPal', status: 'pending' }, address: '456 Oak Ave, Los Angeles, CA 90001' },
  { id: 'ORD-2024-1287', customer: { name: 'Mike Chen', email: 'mike@email.com', phone: '+1 (555) 345-6789', avatar: 'MC' }, date: '2024-01-15T13:15:00', items: [{ name: 'Smart Watch', sku: 'SW-004', qty: 1, price: 249.99 }, { name: 'Yoga Mat', sku: 'YM-005', qty: 2, price: 34.99 }, { name: 'Coffee Maker', sku: 'CM-003', qty: 1, price: 79.99 }, { name: 'Desk Lamp', sku: 'DL-006', qty: 1, price: 44.99 }], total: 456.00, status: 'shipped', payment: { method: 'Mastercard', last4: '8976', status: 'paid' }, address: '789 Pine Rd, Chicago, IL 60601' },
  { id: 'ORD-2024-1286', customer: { name: 'Emily Brown', email: 'emily@email.com', phone: '+1 (555) 456-7890', avatar: 'EB' }, date: '2024-01-14T16:20:00', items: [{ name: 'Gaming Mouse', sku: 'GM-007', qty: 1, price: 59.99 }], total: 59.99, status: 'delivered', payment: { method: 'Visa', last4: '1234', status: 'paid' }, address: '321 Elm St, Houston, TX 77001' },
  { id: 'ORD-2024-1285', customer: { name: 'Alex Rivera', email: 'alex@email.com', phone: '+1 (555) 567-8901', avatar: 'AR' }, date: '2024-01-14T11:05:00', items: [{ name: 'Novel Collection', sku: 'NC-008', qty: 3, price: 24.99 }], total: 74.97, status: 'delivered', payment: { method: 'PayPal', status: 'paid' }, address: '654 Maple Dr, Phoenix, AZ 85001' },
];

export const customers: Customer[] = [
  { id: 1, name: 'John Doe', email: 'john@email.com', avatar: 'JD', orders: 47, spent: 4529, joined: 'Jan 2023', tier: 'VIP' },
  { id: 2, name: 'Sarah Wilson', email: 'sarah@email.com', avatar: 'SW', orders: 23, spent: 2145, joined: 'Mar 2023', tier: 'Regular' },
  { id: 3, name: 'Mike Chen', email: 'mike@email.com', avatar: 'MC', orders: 8, spent: 567, joined: 'Dec 2023', tier: 'New' },
  { id: 4, name: 'Emily Brown', email: 'emily@email.com', avatar: 'EB', orders: 35, spent: 3210, joined: 'Feb 2023', tier: 'VIP' },
  { id: 5, name: 'Alex Rivera', email: 'alex@email.com', avatar: 'AR', orders: 15, spent: 1280, joined: 'Jun 2023', tier: 'Regular' },
  { id: 6, name: 'Lisa Park', email: 'lisa@email.com', avatar: 'LP', orders: 42, spent: 5890, joined: 'Jan 2023', tier: 'VIP' },
  { id: 7, name: 'David Kim', email: 'david@email.com', avatar: 'DK', orders: 3, spent: 189, joined: 'Jan 2024', tier: 'New' },
  { id: 8, name: 'Nina Patel', email: 'nina@email.com', avatar: 'NP', orders: 19, spent: 1756, joined: 'Apr 2023', tier: 'Regular' },
];

export const transactions: Transaction[] = [
  { id: 'TXN-45678901', orderId: 'ORD-1289', customer: 'John Doe', amount: 234.99, method: 'Visa', last4: '4242', status: 'success', time: '2:45 PM' },
  { id: 'TXN-45678900', orderId: 'ORD-1288', customer: 'Sarah Wilson', amount: 89.50, method: 'PayPal', status: 'pending', time: '2:30 PM' },
  { id: 'TXN-45678899', orderId: 'ORD-1287', customer: 'Mike Chen', amount: 456.00, method: 'Mastercard', last4: '8976', status: 'success', time: '1:15 PM' },
  { id: 'TXN-45678898', orderId: 'ORD-1286', customer: 'Emily Brown', amount: 59.99, method: 'Visa', last4: '1234', status: 'success', time: '12:30 PM' },
  { id: 'TXN-45678897', orderId: 'ORD-1285', customer: 'Alex Rivera', amount: 74.97, method: 'PayPal', status: 'success', time: '11:05 AM' },
  { id: 'TXN-45678896', orderId: 'ORD-1284', customer: 'Lisa Park', amount: 312.45, method: 'Visa', last4: '5678', status: 'failed', time: '10:20 AM' },
  { id: 'TXN-45678895', orderId: 'ORD-1283', customer: 'David Kim', amount: 189.00, method: 'Mastercard', last4: '3456', status: 'success', time: '9:45 AM' },
];

export const revenueData = [
  { name: 'Mon', revenue: 4200, orders: 42, customers: 28 },
  { name: 'Tue', revenue: 5800, orders: 58, customers: 35 },
  { name: 'Wed', revenue: 4900, orders: 45, customers: 31 },
  { name: 'Thu', revenue: 6700, orders: 67, customers: 42 },
  { name: 'Fri', revenue: 7200, orders: 72, customers: 48 },
  { name: 'Sat', revenue: 8100, orders: 81, customers: 55 },
  { name: 'Sun', revenue: 5600, orders: 56, customers: 38 },
];

export const monthlyData = [
  { name: 'Jan', revenue: 32000, orders: 320 },
  { name: 'Feb', revenue: 28000, orders: 280 },
  { name: 'Mar', revenue: 35000, orders: 350 },
  { name: 'Apr', revenue: 41000, orders: 410 },
  { name: 'May', revenue: 38000, orders: 380 },
  { name: 'Jun', revenue: 45000, orders: 450 },
  { name: 'Jul', revenue: 52000, orders: 520 },
  { name: 'Aug', revenue: 48000, orders: 480 },
  { name: 'Sep', revenue: 55000, orders: 550 },
  { name: 'Oct', revenue: 61000, orders: 610 },
  { name: 'Nov', revenue: 58000, orders: 580 },
  { name: 'Dec', revenue: 67000, orders: 670 },
];

export const categoryPerformance = [
  { name: 'Electronics', value: 35, color: '#8B5CF6' },
  { name: 'Fashion', value: 28, color: '#06B6D4' },
  { name: 'Home', value: 18, color: '#10B981' },
  { name: 'Sports', value: 12, color: '#F59E0B' },
  { name: 'Other', value: 7, color: '#F43F5E' },
];
