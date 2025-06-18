
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== 'trevor1010@') {
      toast({
        title: "Access Denied",
        description: "Incorrect password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onLogin();
      setLoading(false);
      toast({
        title: "Access Granted",
        description: "Welcome to Admin Panel",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-8">
      <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-2xl">Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">
                Admin Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
