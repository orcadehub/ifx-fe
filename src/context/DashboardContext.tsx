import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDashboardMetrics } from '@/lib/dashboard-api';
import { fetchTopInfluencers, fetchTopBusinessUsers } from '@/lib/top-users-api';
import { fetchPendingOrders } from '@/lib/orders-api';

interface DashboardContextType {
  dashboardData: any;
  topInfluencers: any[];
  topBusinessUsers: any[];
  pendingOrders: any[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<any>({
    totalSpent: 0,
    completedCampaigns: 0,
    totalReach: 0,
    activeRequests: 0,
    totalOrders: 0,
    connectedInfluencers: 0,
    impactScore: 0,
    postStats: { total: 0, reels: 0, videos: 0, shorts: 0 }
  });
  const [topInfluencers, setTopInfluencers] = useState<any[]>([]);
  const [topBusinessUsers, setTopBusinessUsers] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [metrics, influencers, businessUsers, orders] = await Promise.all([
        fetchDashboardMetrics(),
        fetchTopInfluencers(),
        fetchTopBusinessUsers(),
        fetchPendingOrders()
      ]);

      setDashboardData({
        totalSpent: metrics.total_spent || 0,
        completedCampaigns: metrics.completed_campaigns || 0,
        totalReach: metrics.total_reach || 0,
        activeRequests: metrics.active_requests || 0,
        totalOrders: metrics.total_orders || 0,
        connectedInfluencers: metrics.connected_users || 0,
        impactScore: parseInt(metrics.campaign_impact_score?.split('/')[0] || '0'),
        postStats: {
          total: metrics.total_posts || 0,
          reels: metrics.reels || 0,
          videos: metrics.videos || 0,
          shorts: metrics.stories || 0
        }
      });

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

      setPendingOrders(orders.slice(0, 5).map((order: any) => ({
        id: order.id,
        title: order.order_id,
        influencerName: order.order_direction === 'sent' ? order.influencer_user_name : order.user_fullname,
        platforms: [order.platform || 'Instagram'],
        serviceTypes: [order.content_type || order.order_type || 'Post'],
        status: 'Pending',
        timestamp: order.created_at
      })));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        topInfluencers,
        topBusinessUsers,
        pendingOrders,
        isLoading,
        refreshData: loadData
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
