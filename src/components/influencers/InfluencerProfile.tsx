import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Dot, Eye, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaInstagram, FaFacebook, FaYoutube, FaTwitter, FaHeart, FaEye, FaComment, FaShare } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, BarChart, Bar, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface InfluencerProfileProps {
  influencer: any;
  onWishlistToggle: () => void;
  onBook: () => void;
}

const formatFollowers = (num: number) => {
  if (!num || num === 0) return '0';
  if (num >= 1000000000000) return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

const getPlatformIcon = (platform: string) => {
  const platformLower = platform?.toLowerCase();
  switch (platformLower) {
    case 'instagram':
      return <FaInstagram style={{ background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #FCAF45)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />;
    case 'facebook':
      return <FaFacebook style={{ color: '#1877F2' }} />;
    case 'twitter':
      return <FaTwitter style={{ color: '#1DA1F2' }} />;
    case 'youtube':
      return <FaYoutube style={{ color: '#FF0000' }} />;
    default:
      return null;
  }
};

const InfluencerProfile: React.FC<InfluencerProfileProps> = ({ influencer, onWishlistToggle, onBook }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [selectedPriceTab, setSelectedPriceTab] = useState('Platform Based');
  const [selectedPlatform, setSelectedPlatform] = useState('ChoosePlatform');
  const [selectedServicePlatform, setSelectedServicePlatform] = useState('all');

  const handleChatClick = () => {
    navigate('/chats', { state: { selectedUserId: influencer.id } });
  };

  return (
    <div className="border border-border h-[calc(100vh-195px)] rounded-xl bg-card p-2 md:p-4">
      <div className="flex justify-between items-center mb-1 pb-2">
        <h4 className="font-bold mb-0 text-foreground">Profile</h4>
        <Button onClick={onBook} className="bg-primary text-white rounded-lg text-sm px-4 py-2">
          Book Now
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 rounded mb-4">
        <div className="flex items-center gap-3 flex-grow">
          <img
            src={influencer.profilePic || influencer.profile_pic || `https://picsum.photos/seed/${influencer.id}/150`}
            className="rounded-full border border-border"
            width="60"
            height="60"
            alt="Profile"
          />
          <div>
            <h5 className="font-semibold mb-1 flex items-center gap-3 text-foreground">
              {influencer.name}
              <Heart
                size={18}
                className={`cursor-pointer ${influencer.wishlist ? 'text-red-500 fill-red-400' : 'text-foreground'}`}
                title={influencer.wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={onWishlistToggle}
              />
              <MessageCircle
                className="text-foreground cursor-pointer"
                title="Chat"
                size={18}
                onClick={handleChatClick}
              />
            </h5>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>{influencer?.category}</span>
              <span className="flex items-center">
                <Dot /> {influencer?.location_city || 'Location not specified'}, {influencer?.location_state || ''}
              </span>
              <Share2 className="text-foreground" title="Share" size={14} />
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end items-center w-full md:w-fit gap-5 md:gap-4 flex-wrap text-center">
          <div className="flex flex-col items-center">
            <FaInstagram color="#E1306C" size={26} />
            <div className="font-bold text-foreground">
              {formatFollowers(influencer.data?.instagram?.total_followers)}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <FaFacebook color="#1877F2" size={26} />
            <div className="font-bold text-foreground">
              {formatFollowers(influencer.data?.facebook?.total_followers)}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <FaYoutube color="#FF0000" size={26} />
            <div className="font-bold text-foreground">
              {formatFollowers(influencer.data?.youtube?.total_followers)}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <FaTwitter color="#1DA1F2" size={26} />
            <div className="font-bold text-foreground">
              {formatFollowers(influencer.data?.twitter?.total_followers)}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-4 w-full md:px-3 gap-2">
        <div className="flex w-full p-1 gap-2 rounded-xl bg-accent">
          {['services', 'prices', 'data'].map((tab) => (
            <button
              key={tab}
              className={`w-full text-center font-medium text-sm py-1 border-0 text-foreground ${
                activeTab === tab ? 'bg-background' : ''
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="h-[calc(100vh-425px)] overflow-y-auto">
        {activeTab === 'services' && (
          <div className="px-2">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-semibold text-foreground">Services</h5>
              <select
                className="px-3 py-1 border border-border bg-background text-foreground text-sm"
                value={selectedServicePlatform}
                onChange={(e) => setSelectedServicePlatform(e.target.value)}
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
            {influencer.posts && influencer.posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {influencer.posts
                  .filter((post: any) => selectedServicePlatform === 'all' || post.platform?.[0]?.toLowerCase() === selectedServicePlatform)
                  .map((post: any) => (
                  <div key={post.id} className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-all">
                    <div className="relative">
                      <img src={post.image} alt={post.title} className="w-full h-36 object-cover" />
                      <span className="absolute top-2 right-2 text-xl">
                        {getPlatformIcon(post.platform?.[0] || 'instagram')}
                      </span>
                    </div>
                    <div className="p-2">
                      <div className="flex justify-around text-xs text-muted-foreground">
                        <div className="flex flex-col items-center gap-1">
                          <FaHeart className="text-red-500" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <FaEye className="text-foreground" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <FaComment className="text-foreground" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <FaShare className="text-foreground" />
                          <span>{post.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground flex justify-center items-center h-full">
                No posts available.
              </div>
            )}
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="px-3">
            {influencer.pricing || influencer.customPackages?.length > 0 ? (
              <div className="space-y-4">
                {/* Tab Options */}
                <div className="flex gap-2 bg-accent p-1 rounded-xl mb-3">
                  {['Platform Based', 'Custom Package'].map((tab) => (
                    <button
                      key={tab}
                      className={`flex-1 text-center font-medium text-sm py-1 border-0 text-foreground rounded-lg transition-all ${
                        selectedPriceTab === tab ? 'bg-background shadow' : ''
                      }`}
                      onClick={() => setSelectedPriceTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Platform Based Content */}
                {selectedPriceTab === 'Platform Based' && influencer.pricing && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-semibold text-foreground">Platform Services</h5>
                      <select
                        className="px-3 py-1 border border-border bg-background text-foreground text-sm"
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                      >
                        <option value="ChoosePlatform">Choose Platform</option>
                        {Object.keys(influencer.pricing).map((platform) => (
                          <option key={platform} value={platform}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedPlatform === 'ChoosePlatform' ? (
                      <div className="border border-border rounded-xl overflow-hidden">
                        <div className="px-3 py-2 font-semibold text-foreground bg-accent">
                          All Platform Services
                        </div>
                        <div className="px-3 py-2">
                          {(() => {
                            const serviceMap = new Map();
                            Object.entries(influencer.pricing).forEach(([platform, services]: [string, any]) => {
                              Object.entries(services).forEach(([service, price]: [string, any]) => {
                                const numPrice = Number(String(price).replace(/[^0-9.]/g, '')) || 0;
                                const existing = serviceMap.get(service);
                                if (!existing || (numPrice > 0 && numPrice > existing) || (existing === 0 && numPrice > 0)) {
                                  serviceMap.set(service, numPrice);
                                }
                              });
                            });
                            return Array.from(serviceMap.entries()).map(([service, price]) => (
                              <div key={service} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                                <span className="text-sm text-foreground">{service}</span>
                                <span className="font-medium text-primary">₹{price}</span>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    ) : (
                      influencer.pricing[selectedPlatform] && (
                        <div className="border border-border rounded-xl overflow-hidden">
                          <div className="px-3 py-2 font-semibold text-foreground capitalize bg-accent">
                            {selectedPlatform}
                          </div>
                          <div className="px-3 py-2">
                            {Object.entries(influencer.pricing[selectedPlatform]).map(([service, price]: [string, any]) => (
                              <div key={service} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                                <span className="text-sm text-foreground">{service}</span>
                                <span className="font-medium text-primary">₹{String(price).replace(/[^0-9.]/g, '') || 0}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
                
                {/* Custom Packages Content */}
                {selectedPriceTab === 'Custom Package' && influencer.customPackages && influencer.customPackages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {influencer.customPackages.map((pkg: any, idx: number) => (
                      <div key={idx} className="border border-border rounded-lg p-3 bg-card hover:shadow-lg transition-all">
                        <h5 className="font-semibold text-foreground mb-2">{pkg.package_name}</h5>
                        <p className="text-xs text-muted-foreground mb-3">{pkg.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Platforms: {pkg.platforms?.join(', ')}</span>
                          <span className="font-bold text-lg text-primary">₹{pkg.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedPriceTab === 'Custom Package' && (!influencer.customPackages || influencer.customPackages.length === 0) && (
                  <div className="text-center text-muted-foreground py-4">
                    No custom packages available
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No pricing information available.
              </div>
            )}
          </div>
        )}

        {activeTab === 'data' && (
          <div className="w-full overflow-auto px-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Total Posts', value: influencer.metrics?.total_posts || 0 },
                { label: 'Total Campaigns', value: influencer.metrics?.total_campaigns || influencer.data?.totalCampaigns || 0 },
                { label: 'Avg Likes', value: formatFollowers(Math.round((influencer.metrics?.avg_likes || influencer.data?.avgLikes || 0) * 100) / 100) },
                { label: 'Avg Views', value: formatFollowers(Math.round((influencer.metrics?.avg_views || influencer.data?.avgViews || 0) * 100) / 100) },
                { label: 'Avg Comments', value: formatFollowers(Math.round((influencer.metrics?.avg_comments || 0) * 100) / 100) },
                { label: 'Avg Shares', value: formatFollowers(Math.round((influencer.metrics?.avg_shares || 0) * 100) / 100) },
                { label: 'Engagement Rate', value: influencer.metrics?.engagement_rate ? `${(Math.round(influencer.metrics.engagement_rate * 100) / 100).toFixed(2)}%` : influencer.data?.engagement || '0%' },
                { label: 'Fake Followers', value: influencer.metrics?.fake_followers_percentage ? `${(Math.round(influencer.metrics.fake_followers_percentage * 100) / 100).toFixed(2)}%` : '0%' }
              ].map(({ label, value }) => (
                <div key={label} className="border border-border rounded-xl p-3 text-center hover:shadow-xl bg-card transition-all">
                  <div className="font-medium text-foreground text-2xl">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Platform Engagement */}
              <div className="border border-border rounded-xl bg-card p-3">
                <h6 className="font-semibold text-foreground mb-3">Platform Engagement</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={[
                    { platform: 'Instagram', engagement: influencer.data?.instagram?.total_followers || 0 },
                    { platform: 'Facebook', engagement: influencer.data?.facebook?.total_followers || 0 },
                    { platform: 'YouTube', engagement: influencer.data?.youtube?.total_followers || 0 },
                    { platform: 'Twitter', engagement: influencer.data?.twitter?.total_followers || 0 }
                  ]}>
                    <XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                    <Area type="monotone" dataKey="engagement" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Content Performance by Platform */}
              <div className="border border-border rounded-xl bg-card p-3">
                <h6 className="font-semibold text-foreground mb-3">Content Performance by Platform</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Instagram', value: influencer.data?.instagram?.total_followers || 0 },
                        { name: 'Facebook', value: influencer.data?.facebook?.total_followers || 0 },
                        { name: 'YouTube', value: influencer.data?.youtube?.total_followers || 0 },
                        { name: 'Twitter', value: influencer.data?.twitter?.total_followers || 0 }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label={{ fontSize: 12 }}
                    >
                      <Cell fill="#E1306C" />
                      <Cell fill="#1877F2" />
                      <Cell fill="#FF0000" />
                      <Cell fill="#1DA1F2" />
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Audience Growth Trajectory */}
              <div className="border border-border rounded-xl bg-card p-3">
                <h6 className="font-semibold text-foreground mb-3">Audience Growth Trajectory</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    { month: 'Jan', instagram: 1000, youtube: 900, facebook: 800, twitter: 600 },
                    { month: 'Feb', instagram: 1200, youtube: 950, facebook: 950, twitter: 700 },
                    { month: 'Mar', instagram: 1400, youtube: 1000, facebook: 1100, twitter: 800 },
                    { month: 'Apr', instagram: 1600, youtube: 1050, facebook: 1200, twitter: 900 },
                    { month: 'May', instagram: 1800, youtube: 1100, facebook: 1300, twitter: 950 },
                    { month: 'Jun', instagram: 2000, youtube: 1200, facebook: 1400, twitter: 1000 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} />
                    <Line type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} />
                    <Line type="monotone" dataKey="facebook" stroke="#1877F2" strokeWidth={2} />
                    <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Link Clicks by Month */}
              <div className="border border-border rounded-xl bg-card p-3">
                <h6 className="font-semibold text-foreground mb-3">Link Clicks by Month</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { month: 'Jan', clicks: 2500 },
                    { month: 'Feb', clicks: 3000 },
                    { month: 'Mar', clicks: 3500 },
                    { month: 'Apr', clicks: 3200 },
                    { month: 'May', clicks: 4000 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                    <Legend />
                    <Bar dataKey="clicks" fill="#a78bfa" barSize={40} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfluencerProfile;
