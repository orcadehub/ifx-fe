import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Gift, Clock, Check, X, Hourglass, Copy, Share2, Instagram, Facebook, Youtube, Twitter, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Offer, UserPromotion } from '@/types/offer';

const mockCurrentOffer: Offer = {
  id: '1',
  title: 'Summer Campaign 2025',
  description: 'Promote our new summer collection with exclusive discounts for your followers.',
  imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  caption: 'Summer is here! Check out the new collection from @influenceconnect with 20% off using code SUMMER25 #ad',
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true
};

const mockUserPromotions: UserPromotion[] = [
  {
    id: '1',
    offerId: '1',
    generatedUrl: 'https://inf.co/promo/u123/summer25',
    platform: 'Instagram',
    postTime: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'Live',
    timeRemaining: '0h remaining',
    engagement: {
      views: 1245,
      likes: 156,
      shares: 42,
      comments: 28,
      clicks: 93
    },
    rewardStatus: 'Pending'
  },
  {
    id: '2',
    offerId: '1',
    generatedUrl: 'https://inf.co/promo/u456/summer25',
    platform: 'Facebook',
    postTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    status: 'Live',
    timeRemaining: '18h remaining',
    engagement: {
      views: 345,
      likes: 76,
      shares: 18,
      comments: 12,
      clicks: 34
    },
    rewardStatus: 'Pending'
  },
  {
    id: '3',
    offerId: '2',
    generatedUrl: 'https://inf.co/promo/u123/spring25',
    platform: 'Instagram',
    postTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Expired',
    timeRemaining: '0h remaining',
    engagement: {
      views: 189,
      likes: 42,
      shares: 8,
      comments: 5,
      clicks: 17
    },
    rewardStatus: 'Given'
  }
];

const OffersPage = () => {
  const { toast } = useToast();
  const [userType] = useState(() => localStorage.getItem('userType') || 'business');
  const [activePromotions, setActivePromotions] = useState<UserPromotion[]>([]);
  const [urlGenerated, setUrlGenerated] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentOffer, setCurrentOffer] = useState<any>(null);
  const [socialConnections, setSocialConnections] = useState<any>({
    instagram: { connected: false },
    facebook: { connected: false },
    twitter: { connected: false }
  });
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [activeCampaignIds, setActiveCampaignIds] = useState<string[]>([]);
  
  useEffect(() => {
    fetchCampaigns();
    fetchSocialConnections();
    fetchUserPromotions();
    
    const interval = setInterval(() => {
      fetchUserPromotions();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const fetchCampaigns = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/campaigns`);
      const data = await response.json();
      const campaignsData = data.campaigns || data;
      setCampaigns(campaignsData);
      if (campaignsData.length > 0) {
        setCurrentOffer(campaignsData[0]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSocialConnections = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) return;
      
      const user = JSON.parse(userData);
      const response = await fetch(`http://localhost:3001/api/connect/status/${user.email}`);
      const data = await response.json();
      
      setSocialConnections({
        instagram: { connected: data.instagram?.connected || false },
        facebook: { connected: data.facebook?.connected || false },
        twitter: { connected: data.twitter?.connected || false }
      });
    } catch (error) {
      console.error('Error fetching social connections:', error);
    }
  };
  
  const fetchUserPromotions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/promotions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const formattedPromotions = data.map((promo: any) => {
          const createdTime = new Date(promo.created_at).getTime();
          const now = new Date().getTime();
          const elapsed = now - createdTime;
          const twentyFourHours = 24 * 60 * 60 * 1000;
          const remaining = Math.max(0, twentyFourHours - elapsed);
          const hours = Math.floor(remaining / (60 * 60 * 1000));
          const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
          const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
          const canClaimReward = elapsed >= twentyFourHours;
          
          return {
            id: promo.id,
            offerId: promo.campaign_id,
            generatedUrl: promo.unique_url,
            platform: promo.platform || 'Instagram',
            status: promo.status ? 'Live' : 'Expired',
            postTime: promo.created_at,
            expiryTime: new Date(createdTime + twentyFourHours).toISOString(),
            timeRemaining: `${hours}h ${minutes}m ${seconds}s`,
            canClaimReward,
            engagement: {
              views: 0,
              likes: 0,
              shares: 0,
              comments: 0,
              clicks: promo.unique_clicks || 0
            },
            rewardStatus: promo.reward_claimed ? 'Given' : 'Pending',
            storyVerified: promo.story_verified !== false
          };
        });
        setActivePromotions(formattedPromotions);
        
        // Extract active campaign IDs
        const activeCampaigns = data
          .filter((p: any) => !p.reward_claimed && p.status)
          .map((p: any) => p.campaign_id);
        setActiveCampaignIds(activeCampaigns);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };
  
  const generateUniqueUrl = async () => {
    if (!currentOffer) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/generate-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          campaignId: currentOffer.campaign_id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUrlGenerated(true);
        setGeneratedUrl(data.unique_url);
        
        toast({
          title: "URL Generated!",
          description: "Your unique promotional URL has been created.",
        });
        
        await fetchUserPromotions();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to generate URL",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating URL:', error);
      toast({
        title: "Error",
        description: "Failed to generate URL",
        variant: "destructive"
      });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };
  
  const calculateTimeRemaining = (expiryTime?: string) => {
    if (!expiryTime) return '0h remaining';
    
    const expiry = new Date(expiryTime);
    const now = new Date();
    const diffHours = Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60)));
    
    return `${diffHours}h remaining`;
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Live':
        return <Badge className="bg-green-500 hover:bg-green-600"><Check className="w-3 h-3 mr-1" /> Live</Badge>;
      case 'Removed':
        return <Badge className="bg-red-500 hover:bg-red-600"><X className="w-3 h-3 mr-1" /> Removed</Badge>;
      case 'Expired':
        return <Badge className="bg-muted hover:bg-muted/80"><Hourglass className="w-3 h-3 mr-1" /> Expired</Badge>;
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };
  
  const calculateReward = () => {
    return userType === 'business' 
      ? '1 Month Free Subscription' 
      : 'Commission-Free Withdrawal';
  };
  
  const isOfferActive = () => {
    const now = new Date();
    const expiryDate = new Date(mockCurrentOffer.expiresAt);
    return now < expiryDate;
  };
  
  const handlePlatformShare = async (platform: string) => {
    const platformKey = platform.toLowerCase();
    
    if (!socialConnections[platformKey]?.connected) {
      setSelectedPlatform(platform);
      setShowConnectModal(true);
      return;
    }
    
    if (!currentOffer || !generatedUrl) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/social/post-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform: platform.toLowerCase(),
          campaignId: currentOffer.campaign_id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Posted Successfully!",
          description: `Your story has been posted to ${platform}`,
        });
        await fetchUserPromotions();
      } else {
        toast({
          title: "Error",
          description: data.message || `Failed to post to ${platform}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error posting to platform:', error);
      toast({
        title: "Error",
        description: `Failed to post to ${platform}. Please try again.`,
        variant: "destructive"
      });
    }
  };
  
  const handleClaimReward = async (promoId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/promotions/claim-reward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ promotionId: promoId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Reward Claimed!",
          description: "Your reward has been activated successfully.",
        });
        await fetchUserPromotions();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to claim reward",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: "Error",
        description: "Failed to claim reward",
        variant: "destructive"
      });
    }
  };
  
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'Instagram':
        return <Instagram className="w-5 h-5" />;
      case 'Facebook':
        return <Facebook className="w-5 h-5" />;
      case 'YouTube':
        return <Youtube className="w-5 h-5" />;
      default:
        return <Share2 className="w-5 h-5" />;
    }
  };
  
  const calculateProgress = (expiryTime?: string) => {
    if (!expiryTime) return 100;
    
    const postTime = new Date(expiryTime);
    postTime.setHours(postTime.getHours() - 24); // 24 hours earlier
    
    const now = new Date();
    const total = 24 * 60 * 60 * 1000; // 24 hours in ms
    const elapsed = now.getTime() - postTime.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const safeClickElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      element.click();
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="container mx-auto py-6 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading campaigns...</p>
          </div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Gift className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No Active Campaigns</h3>
              <p className="text-muted-foreground text-center max-w-md">
                There are no active promotional campaigns at the moment. Check back later!
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Gift className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">Promotional Offers</h1>
          </div>
        </div>
        
        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="current">Current Offer</TabsTrigger>
            <TabsTrigger value="my-promotions">My Promotions</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <div className="space-y-4">
            {campaigns.map((campaign) => (
            <Card key={campaign.campaign_id}>
              <CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={campaign.image_url} 
                      alt={campaign.name} 
                      className="w-full h-64 object-cover rounded-lg mb-4" 
                    />
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="font-medium text-sm">Suggested Caption:</p>
                      <p className="text-foreground mt-1">{campaign.caption}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => copyToClipboard(campaign.caption)}
                      >
                        <Copy className="w-4 h-4 mr-1" /> Copy Caption
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Promotion Details</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Campaign Period:</span>
                          <span className="font-medium">{campaign.period}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Story Duration Requirement:</span>
                          <span className="font-medium">{campaign.required_time}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Reward:</span>
                          <span className="font-medium">{campaign.reward}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Campaign Ends On:</span>
                          <span className="font-medium">{new Date(campaign.created_at).toLocaleDateString()}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium flex items-center">
                            <><span className="text-green-500 mr-1">🟢</span> {campaign.status}</>
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center"><ClipboardList className="w-5 h-5 mr-2" /> Platform Instructions</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 rounded-lg border border-pink-100 dark:border-pink-900">
                          <div className="flex items-start">
                            <Instagram className="w-5 h-5 mr-2 mt-0.5 text-pink-600 dark:text-pink-400" />
                            <div>
                              <p className="font-semibold text-pink-900 dark:text-pink-100">Instagram</p>
                              <p className="text-sm text-muted-foreground mt-1">Post promotional video as Story with caption & tag @InfluenceConnect — keep it live for 24h to earn your reward.</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-100 dark:border-blue-900">
                          <div className="flex items-start">
                            <Facebook className="w-5 h-5 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="font-semibold text-blue-900 dark:text-blue-100">Facebook</p>
                              <p className="text-sm text-muted-foreground mt-1">Share as Post or Story with caption & tag @InfluenceConnectOfficial — tracked for 24h automatically.</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950 dark:to-cyan-950 rounded-lg border border-sky-100 dark:border-sky-900">
                          <div className="flex items-start">
                            <Twitter className="w-5 h-5 mr-2 mt-0.5 text-sky-600 dark:text-sky-400" />
                            <div>
                              <p className="font-semibold text-sky-900 dark:text-sky-100">Twitter (X)</p>
                              <p className="text-sm text-muted-foreground mt-1">Tweet video link with caption & tag @InfluenceConnect — keep tweet live for 24h.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!urlGenerated ? (
                      activeCampaignIds.includes(campaign.campaign_id) ? (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">You already have an active promotion for this campaign</p>
                          <Button 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => safeClickElement('[data-value="my-promotions"]')}
                          >
                            View My Promotions
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            setCurrentOffer(campaign);
                            generateUniqueUrl();
                          }}
                        >
                          <Gift className="w-5 h-5 mr-2" /> Generate Unique URL
                        </Button>
                      )
                    ) : currentOffer?.campaign_id === campaign.campaign_id ? (
                      <div className="space-y-3">
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Your Generated URL:</p>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-card px-2 py-1 rounded flex-1 overflow-x-auto">{generatedUrl}</code>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(generatedUrl)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`flex flex-col items-center py-3 h-auto ${
                              socialConnections.instagram?.connected 
                                ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                                : 'opacity-50'
                            }`}
                            onClick={() => handlePlatformShare('Instagram')}
                          >
                            <Instagram className="w-5 h-5 mb-1" />
                            <span className="text-xs">Post Story</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`flex flex-col items-center py-3 h-auto ${
                              socialConnections.facebook?.connected 
                                ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                                : 'opacity-50'
                            }`}
                            onClick={() => handlePlatformShare('Facebook')}
                          >
                            <Facebook className="w-5 h-5 mb-1" />
                            <span className="text-xs">Post Story</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`flex flex-col items-center py-3 h-auto ${
                              socialConnections.twitter?.connected 
                                ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                                : 'opacity-50'
                            }`}
                            onClick={() => handlePlatformShare('Twitter')}
                          >
                            <Twitter className="w-5 h-5 mb-1" />
                            <span className="text-xs">Post Tweet</span>
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
            </div>
          </TabsContent>
          
          <TabsContent value="my-promotions">
            <div className="space-y-4">
              {activePromotions.length > 0 ? (
                activePromotions.map(promo => (
                  <Card key={promo.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getPlatformIcon(promo.platform as string)}
                          <span className="ml-2 font-medium">{promo.platform}</span>
                          <span className="mx-2">•</span>
                          {getStatusBadge(promo.status as string)}
                        </div>
                        {promo.status === 'Live' && (
                          <div className="flex items-center">
                            <Hourglass className="w-4 h-4 text-amber-500 mr-1" />
                            <span className="text-sm font-medium">{promo.timeRemaining}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Generated URL:</p>
                          <div className="flex items-center">
                            <div className="bg-muted p-2 rounded flex-1 overflow-x-auto whitespace-nowrap">
                              <code className="text-xs">{promo.generatedUrl}</code>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2"
                              onClick={() => copyToClipboard(promo.generatedUrl as string)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {promo.status === 'Live' && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span>0h</span>
                                <span>24h</span>
                              </div>
                              <Progress value={calculateProgress(promo.expiryTime)} className="h-2" />
                              <p className="text-xs text-center mt-1">Time remaining until reward eligibility</p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Reward:</p>
                              <p className="font-medium">{calculateReward()}</p>
                            </div>
                            <Badge 
                              className={promo.rewardStatus === 'Given' 
                                ? "bg-green-500 hover:bg-green-600" 
                                : "bg-yellow-500 hover:bg-yellow-600"
                              }
                            >
                              {promo.rewardStatus}
                            </Badge>
                          </div>
                          {promo.rewardStatus === 'Pending' && (
                            <>
                              {!(promo as any).storyVerified && (
                                <div className="mb-2 p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
                                  Story not found or removed. Cannot claim reward.
                                </div>
                              )}
                              <Button 
                                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                                onClick={() => handleClaimReward(promo.id)}
                                disabled={!(promo as any).canClaimReward || !(promo as any).storyVerified}
                              >
                                <Gift className="w-4 h-4 mr-2" />
                                {!(promo as any).storyVerified ? 'Story Removed' : (promo as any).canClaimReward ? 'Claim Reward' : `Wait ${promo.timeRemaining}`}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Gift className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No Promotions Yet</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      You haven't created any promotional links yet. Generate a unique URL from the Current Offer tab to get started.
                    </p>
                    <Button onClick={() => safeClickElement('[data-value="current"]')}>
                      View Current Offer
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="how-it-works">
            <Card>
              <CardHeader>
                <CardTitle>How to Earn Rewards with Promotions</CardTitle>
                <CardDescription>
                  Follow these simple steps to promote our campaigns and earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-primary/5 p-4 rounded-lg text-center">
                      <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">1</div>
                      <h3 className="font-medium mb-2">Generate a Unique URL</h3>
                      <p className="text-sm text-muted-foreground">
                        Click the "Generate Unique URL" button on the current promotion to create your personal tracking link.
                      </p>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg text-center">
                      <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">2</div>
                      <h3 className="font-medium mb-2">Post on Social Media</h3>
                      <p className="text-sm text-muted-foreground">
                        Share the promotion on Instagram, Facebook, or YouTube using the provided content and your unique URL.
                      </p>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg text-center">
                      <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">3</div>
                      <h3 className="font-medium mb-2">Keep Live for 24 Hours</h3>
                      <p className="text-sm text-gray-600">
                        Maintain your post for at least 24 hours to qualify for your reward.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Gift className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                      Your Reward
                    </h3>
                    <p className="text-sm text-foreground">
                      After successfully keeping your promotion live for 24 hours, you'll automatically receive:
                    </p>
                    <ul className="mt-2 space-y-1">
                      {userType === 'business' ? (
                        <li className="text-sm flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          1 month Free Subscription to our Premium Business Plan
                        </li>
                      ) : (
                        <li className="text-sm flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          Commission-Free Withdrawal on your next payout
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Rules & Requirements</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-primary font-medium mr-2">•</span>
                        Posts must include the provided caption and your unique URL.
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary font-medium mr-2">•</span>
                        Content must remain live and unchanged for at least 24 hours.
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary font-medium mr-2">•</span>
                        The post must be public and viewable by our tracking system.
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary font-medium mr-2">•</span>
                        Each user can earn one reward per promotional campaign.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => safeClickElement('[data-value="current"]')} className="w-full">
                  View Current Promotion
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      )}
      
      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedPlatform} Account</DialogTitle>
            <DialogDescription>
              You need to connect your {selectedPlatform} account first to post stories.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowConnectModal(false);
              window.location.href = '/account/settings';
            }}>
              Go to Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default OffersPage;
