import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Eye, MessageSquare, Share2, Instagram, Youtube, Facebook } from 'lucide-react';

interface ContentStat {
  likes: number;
  views: number;
  comments: number;
  shares: number;
}

interface ContentItem {
  id: string;
  image: string;
  stats: ContentStat;
  platforms: string[];
}

interface BusinessServicesTabProps {
  userId?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'instagram':
      return <Instagram className="w-4 h-4 text-white" />;
    case 'youtube':
      return <Youtube className="w-4 h-4 text-white" />;
    case 'facebook':
      return <Facebook className="w-4 h-4 text-white" />;
    default:
      return null;
  }
};

const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img 
          src={item.image} 
          alt="Content" 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {item.platforms.map((platform) => (
            <div key={platform} className="bg-black/50 p-1 rounded-full">
              {getPlatformIcon(platform)}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-3 w-full">
            <div className="flex justify-between text-white">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs">{formatNumber(item.stats.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs">{formatNumber(item.stats.views)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 flex justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span>{formatNumber(item.stats.likes)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span>{formatNumber(item.stats.comments)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span>{formatNumber(item.stats.shares)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{formatNumber(item.stats.views)}</span>
        </div>
      </div>
    </Card>
  );
};

const BusinessServicesTab: React.FC<BusinessServicesTabProps> = ({ userId }) => {
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['user-services', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/services/user/${userId}/services`);
      console.log('Services API response:', response.data);
      return response.data;
    },
    enabled: !!userId
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading services...</div>;
  }

  const services = servicesData?.services || [];

  if (services.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No services available</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service: any) => (
        <Card key={service.id} className="p-4">
          <h3 className="font-semibold text-lg mb-2">{service.service_title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{service.project_description}</p>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Budget: ₹{service.budget}</span>
            <span className="text-muted-foreground">{service.timeline}</span>
          </div>
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              service.status === 'completed' ? 'bg-green-100 text-green-800' :
              service.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              service.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {service.status || 'pending'}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BusinessServicesTab;
