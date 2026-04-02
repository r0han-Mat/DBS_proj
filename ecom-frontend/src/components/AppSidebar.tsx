import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const navItems = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard },
  { title: 'Shop', path: '/shop', icon: Package },
  { title: 'Cart', path: '/cart', icon: ShoppingCart },
  { title: 'Users', path: '/users', icon: Users },
  { title: 'Admin', path: '/admin', icon: Shield },
  { title: 'Analytics', path: '/analytics', icon: BarChart3 },
  { title: 'Settings', path: '/settings', icon: Settings },
];

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

  const AppSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: AppSidebarProps) => {
  const location = useLocation();
  const { cartCount, activeUserRole } = useCart();

  const roleNavItems = navItems.filter((item) => {
    if (item.path === '/' || item.path === '/settings') return true; // shared
    if (activeUserRole === 'ADMIN') {
      return ['/admin', '/users', '/analytics'].includes(item.path);
    }
    return ['/shop', '/cart'].includes(item.path); // customer links
  });

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 bg-card border-r border-border flex flex-col',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'transition-transform lg:transition-none duration-300'
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-border shrink-0">
          {!collapsed && <span className="font-bold gradient-text text-lg">EcomStore</span>}
          {collapsed && <span className="font-bold gradient-text text-lg">E</span>}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {roleNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'gradient-bg text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                )}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary-foreground')} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1"
                  >
                    {item.title}
                  </motion.span>
                )}
                {!collapsed && item.path === '/cart' && cartCount > 0 && (
                  <span className="h-5 min-w-[20px] px-1 rounded-full gradient-bg text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                    {item.title}
                    {item.path === '/cart' && cartCount > 0 && ` (${cartCount})`}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default AppSidebar;
