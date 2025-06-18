
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CryptoChart from '../components/CryptoChart';
import Header from '../components/Header';
import JivoChat from '../components/JivoChat';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header />
      <JivoChat />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            CapitalEngine
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            Professional Bitcoin Investment Platform
          </p>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Maximize your returns with our advanced trading algorithms and real-time market analysis. 
            Secure, transparent, and profitable Bitcoin investments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                    Start Investing
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3 text-lg">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Live Bitcoin Chart */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Live Bitcoin Price
          </h2>
          <p className="text-slate-400 text-lg">
            Real-time market data and trading opportunities
          </p>
        </div>
        <CryptoChart />
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose CapitalEngine?
          </h2>
          <p className="text-slate-400 text-lg">
            Advanced features for serious Bitcoin investors
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-blue-400 text-xl">🚀 High Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Our advanced algorithms deliver consistent profits with minimal risk exposure.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-400 text-xl">🔒 Secure Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Bank-level security with multi-signature wallets and cold storage protection.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-400 text-xl">📊 Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Professional trading tools with live market data and advanced charting.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400">
            © 2024 CapitalEngine. Professional Bitcoin Investment Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
