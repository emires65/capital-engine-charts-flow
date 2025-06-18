
import { useEffect } from 'react';

const JivoChat = () => {
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

  return null;
};

export default JivoChat;
