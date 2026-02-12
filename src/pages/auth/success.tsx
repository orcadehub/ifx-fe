import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get('platform') || 'social media';

  const platformIcons: { [key: string]: any } = {
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    twitter: Twitter
  };

  const Icon = platformIcons[platform] || CheckCircle;

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard/settings');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Connection Successful!</CardTitle>
          <CardDescription>
            Your {platform.charAt(0).toUpperCase() + platform.slice(1)} account has been connected successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
            <Icon className="h-6 w-6" />
            <span className="font-medium capitalize">{platform}</span>
          </div>
          
          <Button 
            onClick={() => navigate('/dashboard/settings')} 
            className="w-full"
          >
            Go to Settings
          </Button>
          
          <p className="text-sm text-center text-muted-foreground">
            Redirecting automatically in 5 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
