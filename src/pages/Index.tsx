
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    // Check if user is authenticated with Supabase
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session && userType) {
        // If user is authenticated, redirect to appropriate dashboard
        navigate(`/dashboard/${userType}`);
      } else if (data.session) {
        // If session exists but no userType, try to get from metadata
        const userTypeFromMetadata = data.session.user?.user_metadata?.user_type;
        if (userTypeFromMetadata) {
          localStorage.setItem('userType', userTypeFromMetadata);
          navigate(`/dashboard/${userTypeFromMetadata}`);
        } else {
          // If still no userType, redirect to landing
          navigate('/landing');
        }
      } else {
        // If user is not authenticated, redirect to landing page
        localStorage.removeItem('userType'); // Ensure userType is cleared if no session
        navigate('/landing');
      }
    };
    
    checkAuth();
  }, [userType, navigate]);

  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3">
          <img src="/Favicon_Logo.png" alt="Loading" className="w-16 h-16 animate-bounce" />
          <div className="text-4xl font-bold">
            <span className="text-primary animate-pulse">Influex</span>
            <span className="text-foreground animate-pulse" style={{ animationDelay: '0.2s' }}>Konnect</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
