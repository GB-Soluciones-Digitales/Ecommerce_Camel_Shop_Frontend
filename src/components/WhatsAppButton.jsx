import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; 

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/+5493434676232" 
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
      aria-label="Chat en WhatsApp"
    >
      <FaWhatsapp size={32} />
    </a>
  );
};

export default WhatsAppButton;