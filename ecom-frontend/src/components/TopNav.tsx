import { Bell, Moon, Search, Sun, Menu, ShoppingBag, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface TopNavProps {
  darkMode: boolean;
  toggleDark: () => void;
  toggleSidebar: () => void;
}

const TopNav = ({ darkMode, toggleDark, toggleSidebar }: TopNavProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { activeUserName, activeUserId, cartCount, clearActiveUser } = useCart();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50 px-4 md:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold hidden sm:block">
            <span className="gradient-text">EcomStore</span> <span className="text-muted-foreground font-medium">Pro</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" onClick={toggleDark}>
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Link to="/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 text-[10px] font-bold rounded-full gradient-bg text-primary-foreground flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </Link>

        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
          {activeUserId ? (
            <>
              <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground">
                {activeUserName?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium hidden sm:block">{activeUserName}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { clearActiveUser(); window.location.href = '/login'; }} title="Sign out">
                <LogOut className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
