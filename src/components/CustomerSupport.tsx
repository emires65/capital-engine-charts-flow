
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomerSupport = () => {
  useEffect(() => {
    // Create and append the Jivo chat script
    const script = document.createElement('script');
    script.src = 'https://code.jivosite.com/widget/1sAbZ2WKYc';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on component unmount
      const existingScript = document.querySelector('script[src="https://code.jivosite.com/widget/1sAbZ2WKYc"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Customer Support</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="text-slate-300 mb-4">
            Need help? Our support team is available 24/7
          </div>
          <div className="text-sm text-slate-400">
            Click the chat widget in the bottom right corner to start a conversation
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSupport;
