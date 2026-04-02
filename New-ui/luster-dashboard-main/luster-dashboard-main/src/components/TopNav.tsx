import { Bell, Moon, Search, Sun, Menu, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TopNavProps {
  darkMode: boolean;
  toggleDark: () => void;
  toggleSidebar: () => void;
}

const TopNav = ({ darkMode, toggleDark, toggleSidebar }: TopNavProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

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
            <span className="gradient-text">ShopAdmin</span> <span className="text-muted-foreground font-medium">Pro</span>
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full pl-10 pr-16 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 text-[10px] font-bold rounded-full gradient-bg text-primary-foreground flex items-center justify-center">3</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleDark}>
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
          <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground">
            A
          </div>
          <span className="text-sm font-medium hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
