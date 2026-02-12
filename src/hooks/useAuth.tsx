
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';

type UserType = 'business' | 'influencer' | 'admin';

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('business');
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data } = await apiClient.post('/login', {
        email,
        password,
      });
      
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store auth token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userType', data.user.role);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      console.log('Stored userId:', data.user.id);
      
      toast({
        title: "Signed in successfully!",
        description: `Welcome back to InfluenceConnect as ${data.user.role}.`,
      });
      
      navigate(`/dashboard/${data.user.role}`);
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.response?.data?.message || error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    userType,
    setUserType,
    handleSignIn
  };
};
