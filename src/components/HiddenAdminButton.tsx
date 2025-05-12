
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HiddenAdminButton = () => {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const clickTimeout = 2000; // 2 seconds to reset the click counter
  
  const handleClick = () => {
    const now = Date.now();
    
    // Reset counter if too much time has passed since last click
    if (now - lastClickTime > clickTimeout) {
      setClicks(1);
    } else {
      setClicks(clicks + 1);
    }
    
    setLastClickTime(now);
    
    // Navigate to admin page after 5 clicks
    if (clicks + 1 >= 5) {
      navigate('/admin');
      setClicks(0);
    }
  };
  
  return (
    <div 
      onClick={handleClick}
      className="fixed bottom-4 right-4 w-16 h-16 cursor-default"
      style={{ 
        position: 'fixed',
        opacity: 0,
        pointerEvents: 'auto', // Still allow clicks
        zIndex: 50, // High z-index to make it clickable
      }}
      aria-hidden="true"
    />
  );
};

export default HiddenAdminButton;
