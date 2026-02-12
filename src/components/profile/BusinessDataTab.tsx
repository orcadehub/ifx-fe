import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend, LineChart, Line, Dot } from 'recharts';
import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react'; // Import social media icons

const MetricCard: React.FC<{ value: string; title: string }> = ({ value, title }) => (
  <Card className="bg-muted">
    <CardContent className="p-4 text-center">
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{title}</div>
    </CardContent>
  </Card>
);

const BusinessDataTab: React.FC = () => {
  // Data for the new "Number of Orders by Platform" bar chart
  const platformOrdersData = [
    { name: 'instagram', orders: 120 },
    { name: 'facebook', orders: 90 },
    { name: 'youtube', orders: 75 },
    { name: 'twitter', orders: 150 }, // Added Twitter data
  ];

  // Data for the "Links vs Clicks" pie chart
  const linksClicksData = [
    { name: 'Total Links Generated', value: 500 },
    { name: 'Total Clicks Received', value: 350 },
  ];

  const COLORS = ['#0088FE', '#00C49F']; // Colors for the pie chart slices

  // Data for the new "Orders by Month" line chart
  const ordersByMonthData = [
    { name: 'Jan', orders: 40 },
    { name: 'Feb', orders: 55 },
    { name: 'Mar', orders: 80 },
    { name: 'Apr', orders: 65 },
    { name: 'May', orders: 95 },
  ];

  // Helper function to get platform icon component
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'twitter': // Added Twitter icon
        return <Twitter className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Custom X-Axis Tick for platform icons
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y + 15})`}> {/* Increased y offset for space */}
        <foreignObject x={-12} y={-12} width={24} height={24} className="flex items-center justify-center">
          {getPlatformIcon(payload.value)}
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard value="90" title="Total Campaigns" />
        <MetricCard value="90" title="Avg Likes" />
        <MetricCard value="90" title="Engagement" />
        <MetricCard value="90" title="Avg Comments" />
        <MetricCard value="90" title="Avg Shares" />
        <MetricCard value="90" title="Impressions" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Added grid for side-by-side layout */}
        {/* Number of Orders by Platform Bar Graph */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-4 text-foreground">Number of Orders by Platform</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformOrdersData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={CustomXAxisTick} tickLine={false} axisLine={false} />
                  <YAxis dataKey="orders" />
                  <Tooltip formatter={(value: number) => [`${value} Orders`, 'Orders']} />
                  <Bar dataKey="orders" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Links vs Clicks Pie Chart */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-4 text-foreground">Links vs Clicks</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={linksClicksData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {linksClicksData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Month Line Graph */}
      <Card className="bg-card mt-6"> {/* Added mt-6 for spacing */}
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-4 text-foreground">Orders by Month</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersByMonthData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value} Orders`, 'Orders']} />
                <Line type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDataTab;
