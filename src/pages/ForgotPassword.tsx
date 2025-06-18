
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import Header from '../components/Header';
import JivoChat from '../components/JivoChat';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await resetPassword(email);
      if (success) {
        setSent(true);
        toast({
          title: "Reset Email Sent",
          description: "Please check your email for password reset instructions.",
        });
      } else {
        toast({
          title: "Error",
          description: "Unable to send reset email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header />
      <JivoChat />
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
              <CardDescription className="text-slate-400">
                {sent 
                  ? "Check your email for reset instructions"
                  : "Enter your email to receive reset instructions"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Email'}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="text-emerald-400 text-sm mb-4">
                    ✓ Reset instructions sent successfully!
                  </div>
                  <Button 
                    onClick={() => setSent(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Send Another Email
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link 
                  to="/login" 
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
