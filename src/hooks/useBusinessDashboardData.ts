import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { InfluencerRequest, RequestStatus, ServiceType } from '@/types/request';
import { toast } from 'sonner';
import { fetchDashboardMetrics } from '@/lib/dashboard-api';
import { fetchTopInfluencers, fetchTopBusinessUsers } from '@/lib/top-users-api';
import { fetchPendingOrders } from '@/lib/orders-api';

interface DashboardData {
  totalSpent: number;
  completedCampaigns: number;
  totalReach: number;
  activeRequests: number;
  totalOrders: number;
  connectedInfluencers: number;
  impactScore: number;
  postStats: {
    total: number;
    reels: number;
    videos: number;
    shorts: number;
  };
}

export const useBusinessDashboardData = () => {
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalSpent: 0,
    completedCampaigns: 0,
    totalReach: 0,
    activeRequests: 0,
    totalOrders: 0,
    connectedInfluencers: 0,
    impactScore: 0,
    postStats: {
      total: 0,
      reels: 0,
      videos: 0,
      shorts: 0
    }
  });
  
  // Mock data for the components
  const [topPerformedOrders, setTopPerformedOrders] = useState([{
    id: '1',
    title: 'Summer Collection',
    platforms: ['Instagram', 'Facebook'],
    serviceTypes: ['reel', 'story'],
    performanceScore: 95,
    engagement: 9.2,
    reach: 65000
  }, {
    id: '2',
    title: 'Product Launch',
    platforms: ['Youtube'],
    serviceTypes: ['video'],
    performanceScore: 89,
    engagement: 7.5,
    reach: 48000
  }, {
    id: '3',
    title: 'Brand Promotion',
    platforms: ['Instagram', 'Twitter'],
    serviceTypes: ['post', 'reel'],
    performanceScore: 82,
    engagement: 6.7,
    reach: 35000
  }, {
    id: '4',
    title: 'Tutorial Series',
    platforms: ['Facebook', 'Youtube'],
    serviceTypes: ['video', 'short'],
    performanceScore: 78,
    engagement: 5.4,
    reach: 28000
  }, {
    id: '5',
    title: 'Brand Partnership',
    platforms: ['Twitter'],
    serviceTypes: ['post'],
    performanceScore: 75,
    engagement: 4.9,
    reach: 22000
  }]);
  
  const [topInfluencers, setTopInfluencers] = useState([{
    id: '1',
    name: 'Priya Sharma',
    username: 'priyasharma',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    ordersCount: 24
  }, {
    id: '2',
    name: 'Raj Malhotra',
    username: 'rajmalhotra',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    ordersCount: 21
  }, {
    id: '3',
    name: 'Aisha Khan',
    username: 'aishakhan',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    ordersCount: 18
  }, {
    id: '4',
    name: 'Vikram Patel',
    username: 'vikrampatel',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    ordersCount: 15
  }, {
    id: '5',
    name: 'Neha Singh',
    username: 'nehasingh',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200',
    ordersCount: 13
  }]);
  
  const [topBusinessUsers, setTopBusinessUsers] = useState([{
    id: '1',
    name: 'Fashion Forward',
    username: 'fashionforward',
    profileImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=200',
    ordersCount: 28
  }, {
    id: '2',
    name: 'Tech Haven',
    username: 'techhaven',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200',
    ordersCount: 24
  }, {
    id: '3',
    name: 'Beauty Essentials',
    username: 'beautyessentials',
    profileImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=200',
    ordersCount: 20
  }, {
    id: '4',
    name: 'Health First',
    username: 'healthfirst',
    profileImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=200',
    ordersCount: 16
  }, {
    id: '5',
    name: 'Fitness Hub',
    username: 'fitnesshub',
    profileImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200',
    ordersCount: 14
  }]);
  
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    loadTopUsers();
  }, [navigate]);

  const loadTopUsers = async () => {
    try {
      const [influencers, businessUsers, orders] = await Promise.all([
        fetchTopInfluencers(),
        fetchTopBusinessUsers(),
        fetchPendingOrders()
      ]);
      
      setTopInfluencers(influencers.map((inf: any) => ({
        id: inf.id,
        name: inf.name,
        username: inf.name.toLowerCase().replace(/\s+/g, ''),
        profileImage: inf.profile_pic,
        ordersCount: inf.order_count
      })));
      
      setTopBusinessUsers(businessUsers.map((bus: any) => ({
        id: bus.id,
        name: bus.name,
        username: bus.email.split('@')[0],
        profileImage: bus.img,
        ordersCount: bus.orders
      })));
      
      setPendingOrders(orders);
    } catch (error) {
      console.error('Error loading top users:', error);
    }
  };

  const calculateImpactScore = (
    engagementRate: number,
    reach: number,
    consistency: number,
    platformDiversity: number,
    orderCompletionRate: number
  ) => {
    // Ensure all inputs are valid numbers, defaulting to 0 if NaN
    const safeEngagementRate = isNaN(engagementRate) ? 0 : Math.min(engagementRate, 100);
    const safeReach = isNaN(reach) ? 0 : Math.min(reach, 100);
    const safeConsistency = isNaN(consistency) ? 0 : Math.min(consistency, 100);
    const safePlatformDiversity = isNaN(platformDiversity) ? 0 : Math.min(platformDiversity, 100);
    const safeOrderCompletionRate = isNaN(orderCompletionRate) ? 0 : Math.min(orderCompletionRate, 100);

    return Math.round(
      (safeEngagementRate * 0.35) +
      (safeReach * 0.25) +
      (safeConsistency * 0.15) +
      (safePlatformDiversity * 0.10) +
      (safeOrderCompletionRate * 0.15)
    );
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const userData = localStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;
      
      if (!user) {
        navigate('/signin');
        return;
      }

      const data = await fetchDashboardMetrics();
      
      setDashboardData({
        totalSpent: data.total_spent || 0,
        completedCampaigns: data.completed_campaigns || 0,
        totalReach: data.total_reach || 0,
        activeRequests: data.active_requests || 0,
        totalOrders: data.total_orders || 0,
        connectedInfluencers: data.connected_users || 0,
        impactScore: parseInt(data.campaign_impact_score?.split('/')[0] || '0'),
        postStats: {
          total: data.total_posts || 0,
          reels: data.reels || 0,
          videos: data.videos || 0,
          shorts: data.stories || 0
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayRequest = async (requestId: string) => {
    try {
      // First get the request details
      const { data: request, error: requestError } = await supabase
        .from('order_requests')
        .select('*')
        .eq('id', requestId)
        .single();
      
      if (requestError) throw requestError;

      // Update request status to paid
      const { error: updateError } = await supabase
        .from('order_requests')
        .update({ status: 'paid' })
        .eq('id', requestId);
      
      if (updateError) throw updateError;

      // Create payment record
      const { data: userData } = await supabase.auth.getUser();
      const platformFee = request.price * 0.10; // 10% platform fee

      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: requestId,
          business_id: userData.user?.id,
          influencer_id: request.influencer_id,
          amount: request.price,
          currency: request.currency,
          platform_fee: platformFee,
          total_amount: request.price + platformFee,
          status: 'completed',
          payment_date: new Date().toISOString(),
          payment_method: 'card',
          transaction_id: `tr_${Math.random().toString(36).substring(2, 15)}`
        });
      
      if (paymentError) throw paymentError;

      // Show success message
      uiToast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully. The influencer has been notified."
      });

      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: 'paid' as RequestStatus, updatedAt: new Date().toISOString() } 
            : request
        )
      );

      // After a delay, simulate the influencer completing the order
      setTimeout(async () => {
        const { error: completeError } = await supabase
          .from('order_requests')
          .update({ status: 'completed' })
          .eq('id', requestId);
        
        if (!completeError) {
          // Create a post record
          await supabase
            .from('posts')
            .insert({
              order_id: requestId,
              influencer_id: request.influencer_id,
              business_id: userData.user?.id,
              platform: request.platform,
              post_type: request.service_type,
              content: request.description,
              status: 'published',
              published_time: new Date().toISOString(),
              is_approved: true
            });
          
          uiToast({
            title: "Campaign Completed",
            description: "The influencer has published your content. View analytics in the Reach page."
          });

          // Update local state
          setRequests(prevRequests => 
            prevRequests.map(req => 
              req.id === requestId 
                ? { ...req, status: 'completed' as RequestStatus, updatedAt: new Date().toISOString() } 
                : req
            )
          );
        }
      }, 3000);
    } catch (error) {
      console.error('Error processing payment:', error);
      uiToast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewOrder = (orderId: string) => {
    uiToast({
      title: "Order Details",
      description: `Viewing details for order ${orderId}`
    });
    // In a real app, navigate to order details page or show a modal
  };

  return {
    isLoading,
    dashboardData,
    requests,
    topPerformedOrders,
    topInfluencers,
    topBusinessUsers,
    pendingOrders,
    handlePayRequest,
    handleViewOrder
  };
};
