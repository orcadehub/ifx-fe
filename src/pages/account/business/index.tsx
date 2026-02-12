import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Share, MessageSquare, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BusinessDetails from '@/components/profile/BusinessDetails';
import BusinessServicesTab from '@/components/profile/BusinessServicesTab';
import BusinessDataTab from '@/components/profile/BusinessDataTab';
import BusinessGalleryTab from '@/components/profile/BusinessGalleryTab';
import BusinessEditModal from '@/components/profile/BusinessEditModal';

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const userId = localStorage.getItem('userId');

  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: ['business-profile', userId],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/user-profile');
      return response.data;
    },
    enabled: !!userId
  });

  const { data: galleryData } = useQuery({
    queryKey: ['user-gallery', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard/gallery/${userId}`);
      return response.data;
    },
    enabled: !!userId
  });

  const user = profileData?.user;
  const profile = profileData?.profile || {};

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedData: any) => {
    try {
      await apiClient.put('/dashboard/update-profile', updatedData);
      refetch();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  React.useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (!userId || userType !== 'business') {
      navigate('/signin');
    }
  }, [navigate, userId]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-32 bg-muted rounded-lg w-full"></div>
            <div className="h-64 bg-muted rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-3 py-6">
          <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-primary/60 to-primary"></div>
              <div className="absolute left-6 -bottom-12">
                <div className="rounded-full border-4 border-background overflow-hidden h-24 w-24 bg-background">
                  <img 
                    src={user?.profile_pic || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute right-6 bottom-6 flex gap-2">
                <Button variant="secondary">
                  <MessageSquare className="mr-2 h-4 w-4" /> Message
                </Button>
                <Button variant="secondary">
                  <Share className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>

            <div className="pt-16 px-4 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{user?.fullname || 'Username'}</h1>
                  <p className="text-muted-foreground">{user?.email || 'username@gmail.com'}</p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/10 hover:bg-pink-500/20 transition-colors cursor-pointer">
                    <Instagram className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/10 hover:bg-blue-600/20 transition-colors cursor-pointer">
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600/10 hover:bg-red-600/20 transition-colors cursor-pointer">
                    <Youtube className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-400/10 hover:bg-blue-400/20 transition-colors cursor-pointer">
                    <Twitter className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3 flex-shrink-0">
                  <BusinessDetails 
                    businessName={profile?.company_name || "ABC company"}
                    category={profile?.industry || "XYZ Products"}
                    serviceType={profile?.service_type || "Online & Offline"}
                    website={profile?.website || "www.xyz.com"}
                    location={profile?.location || "[Address]"}
                    isRegistered={!!profile?.company_name}
                    onEdit={handleEdit}
                  />
                </div>

                <div className="md:w-2/3 flex-grow">
                  <Tabs defaultValue="services" className="w-full">
                    <div className="border-b border-border mb-6">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="data">Data</TabsTrigger>
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="services" className="mt-0">
                      <BusinessServicesTab />
                    </TabsContent>
                    
                    <TabsContent value="data" className="mt-0">
                      <BusinessDataTab />
                    </TabsContent>
                    
                    <TabsContent value="gallery" className="mt-0">
                      <BusinessGalleryTab 
                        gallery={galleryData?.gallery || []} 
                        isOwnProfile={true}
                        userId={userId}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditing && (
        <BusinessEditModal 
          isOpen={isEditing}
          onClose={handleCancel}
          onSave={handleSave}
          initialData={{
            company_name: profile?.company_name,
            industry: profile?.industry,
            website: profile?.website,
            service_type: profile?.service_type,
            location: profile?.location
          }}
        />
      )}
    </div>
  );
};

export default BusinessProfile;
