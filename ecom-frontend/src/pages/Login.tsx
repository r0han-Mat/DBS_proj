import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserCircle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/context/CartContext';
import { getUsers } from '@/api/apiService';
import { toast } from 'sonner';

// Utility to load scripts dynamically
const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const Login = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const { setActiveUser } = useCart();
  const navigate = useNavigate();

  // Vanta.js configuration
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
        .then(() => loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js'))
        .then(() => {
          setVantaEffect(
            (window as any).VANTA.HALO({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              baseColor: 0xa98c76, // Warm taupe/sand
              backgroundColor: 0x1c1a19, // Dark warm gray/brown
              size: 1.50
            })
          );
        })
        .catch(err => console.error("Could not load Vanta scripts:", err));
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    getUsers()
      .then(data => setUsers(data))
      .catch(() => toast.error('Failed to load users for login'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Please select a user to login');
      return;
    }
    
    const user = users.find(u => String(u.id) === selectedUserId);
    if (user) {
      setActiveUser(user.id, `${user.firstName} ${user.lastName}`, user.role);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Vanta Animation Background Overlay */}
      <div ref={vantaRef} className="absolute inset-0 z-0 opacity-80" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-xl">ES</span>
          </div>
          <h1 className="text-4xl font-bold font-heading text-white drop-shadow-md">Ecom App</h1>
          <p className="text-muted-foreground mt-2 font-medium">Sign in to access your dashboard</p>
        </div>

        <Card className="shadow-2xl border-muted/50 overflow-hidden relative glass backdrop-blur-xl">
          {/* Subtle gradient accent on top of card */}
          <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
          
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Select an identity to proceed.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground skeleton-shimmer rounded-md h-10 w-full" />
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Choose a profile..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(u => (
                        <SelectItem key={u.id} value={String(u.id)} className="py-3">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-2">
                              {u.role === 'ADMIN' ? (
                                <ShieldCheck className="h-4 w-4 text-primary" />
                              ) : (
                                <UserCircle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="font-medium">{u.firstName} {u.lastName}</span>
                            </div>
                            <Badge variant="outline" className={u.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20 text-[10px]' : 'text-[10px]'}>
                              {u.role}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full h-11 gradient-bg text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all font-semibold" disabled={!selectedUserId}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </form>
            )}
            
            <div className="mt-6 text-center text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border">
              <p>Demo Mode: Password authentication is disabled.<br/>Simply select a user profile to sign in.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
