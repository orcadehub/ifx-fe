import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatNumber } from '@/components/influencers/utils/formatUtils';

interface DataTabContentProps {
  influencerId?: string;
}

const MetricCard = ({ value, label }: { value: number | string; label: string }) => (
  <div className="bg-muted rounded-lg p-4 flex flex-col items-center">
    <span className="text-3xl font-medium text-foreground">{value}</span>
    <span className="text-sm text-muted-foreground mt-1">{label}</span>
  </div>
);

const priceRangeData = [
  { price: 2000, count: 2 },
  { price: 2100, count: 3 },
  { price: 2200, count: 4 },
  { price: 2300, count: 5 },
  { price: 2400, count: 6 },
  { price: 2500, count: 7 },
  { price: 2600, count: 8 },
  { price: 2700, count: 7 },
  { price: 2800, count: 6 },
  { price: 2900, count: 5 },
  { price: 3000, count: 4 },
  { price: 3100, count: 3 },
  { price: 3200, count: 2 },
];

const performanceComparisonData = [
  { month: 'Jan', yourWeight: 200, idealWeight: 220 },
  { month: 'Feb', yourWeight: 280, idealWeight: 220 },
  { month: 'Mar', yourWeight: 280, idealWeight: 220 },
  { month: 'Apr', yourWeight: 200, idealWeight: 220 },
  { month: 'May', yourWeight: 200, idealWeight: 220 },
  { month: 'Jun', yourWeight: 270, idealWeight: 220 },
  { month: 'Jul', yourWeight: 280, idealWeight: 220 },
];

const engagementData = [
  { date: 'Feb', value: 52 },
  { date: 'Mar', value: 55 },
  { date: 'Apr', value: 58 },
  { date: 'May', value: 60 },
  { date: 'Jun', value: 62 },
];

// Platform performance data
const platformPerformanceData = [
  { name: 'Instagram', value: 40 },
  { name: 'Facebook', value: 30 },
  { name: 'Twitter', value: 15 },
  { name: 'YouTube', value: 15 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

// Audience growth data
const audienceGrowthData = [
  { month: 'Jan', instagram: 1000, facebook: 800, youtube: 600, twitter: 400 },
  { month: 'Feb', instagram: 1200, facebook: 900, youtube: 700, twitter: 500 },
  { month: 'Mar', instagram: 1300, facebook: 1000, youtube: 800, twitter: 600 },
  { month: 'Apr', instagram: 1500, facebook: 1200, youtube: 900, twitter: 700 },
  { month: 'May', instagram: 1700, facebook: 1300, youtube: 950, twitter: 800 },
  { month: 'Jun', instagram: 1900, facebook: 1400, youtube: 1000, twitter: 900 },
];

// Conversion funnel data
const conversionFunnelData = [
  { month: 'Jan', clicks: 2500 },
  { month: 'Feb', clicks: 3000 },
  { month: 'Mar', clicks: 3500 },
  { month: 'Apr', clicks: 3200 },
  { month: 'May', clicks: 4000 },
];

const DataTabContent: React.FC<DataTabContentProps> = ({ influencerId }) => {
  const { analytics, loading, error } = useAnalyticsData(influencerId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>Error loading analytics data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard 
          value={analytics?.total_campaigns || 90} 
          label="Total Campaigns" 
        />
        <MetricCard 
          value={analytics?.avg_likes ? formatNumber(analytics.avg_likes) : "90"} 
          label="Avg Likes" 
        />
        <MetricCard 
          value={analytics?.avg_views ? formatNumber(analytics.avg_views) : "90K"} 
          label="Avg Views" 
        />
        <MetricCard 
          value={analytics?.avg_reach ? formatNumber(analytics.avg_reach) : "500K"} 
          label="Avg Reach" 
        />
        <MetricCard 
          value={analytics?.engagement_rate ? `${analytics.engagement_rate}%` : "90%"} 
          label="Engagement" 
        />
        <MetricCard 
          value={analytics?.avg_comments ? formatNumber(analytics.avg_comments) : "90"} 
          label="Avg Comments" 
        />
        <MetricCard 
          value={analytics?.avg_shares ? formatNumber(analytics.avg_shares) : "90"} 
          label="Avg Shares" 
        />
        <MetricCard 
          value={analytics?.fake_followers_percent ? `${analytics.fake_followers_percent}%` : "1%"} 
          label="Fake Followers" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Rate Over Time */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={engagementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4F46E5" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorGradient)" 
                name="Engagement Rate (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Content Performance by Platform */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Content Performance by Platform</h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={platformPerformanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Growth Trajectory */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Audience Growth Trajectory</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={audienceGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
              <Legend />
              <Line type="monotone" dataKey="instagram" stroke="#E1306C" />
              <Line type="monotone" dataKey="facebook" stroke="#4267B2" />
              <Line type="monotone" dataKey="youtube" stroke="#FF0000" />
              <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Conversion Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Link Clicks by Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conversionFunnelData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
              <Legend />
              <Bar dataKey="clicks" fill="#8884d8" name="Link Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default DataTabContent;
