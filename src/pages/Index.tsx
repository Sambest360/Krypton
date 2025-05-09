
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simply redirect to the landing page
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse-gentle text-2xl font-semibold text-trading-primary">
        Loading...
      </div>
    </div>
  );
};

export default Index;
