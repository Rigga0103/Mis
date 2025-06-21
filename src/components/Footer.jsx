import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 fixed bottom-0 left-0 right-0 z-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Powered by{' '}
            <a 
              href="https://www.botivate.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Botivate
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;