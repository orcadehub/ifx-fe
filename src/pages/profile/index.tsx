import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Share, MessageSquare, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import BusinessDetails from '@/components/profile/BusinessDetails';
import BusinessServicesTab from '@/components/profile/BusinessServicesTab';
import BusinessDataTab from '@/components/profile/BusinessDataTab';
import BusinessGalleryTab from '@/components/profile/BusinessGalleryTab';
import BusinessEditModal from '@/components/profile/BusinessEditModal';

const PublicProfilePage = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem('userId');
  const isOwnProfile = loggedInUserId === userid;
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  console.log('PublicProfilePage - userid:', userid);
  console.log('PublicProfilePage - loggedInUserId:', loggedInUserId);
  console.log('PublicProfilePage - isOwnProfile:', isOwnProfile);
  console.log('=== EDIT BUTTON DEBUG ===');
  console.log('Will show edit button?', isOwnProfile);
  console.log('isEditing state:', isEditing);

  const handleCopyLink = () => {
    const profileUrl = `${window.location.origin}/profile/${userid}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const profileUrl = `${window.location.origin}/profile/${userid}`;
    const text = `Check out ${user?.fullname}'s profile`;
    
    const urls: { [key: string]: string } = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + profileUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
      instagram: `https://www.instagram.com/`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(text)}`,
      snapchat: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(profileUrl)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(profileUrl)}&title=${encodeURIComponent(text)}`
    };
    
    window.open(urls[platform], '_blank');
  };

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['public-profile', userid],
    queryFn: async () => {
      console.log('Fetching profile for userid:', userid);
      console.log('API Base URL:', apiClient.defaults.baseURL);
      try {
        const response = await apiClient.get(`/profile/${userid}`, { timeout: 5000 });
        console.log('Profile response:', response.data);
        return response.data;
      } catch (err: any) {
        console.log('Profile API error:', err.message, err.response?.status);
        console.log('Trying basic endpoint');
        const response = await apiClient.get(`/dashboard/user/${userid}/basic`, { timeout: 5000 });
        console.log('Basic profile response:', response.data);
        return response.data.user;
      }
    },
    enabled: !!userid,
    retry: false
  });

  const { data: userProfileData } = useQuery({
    queryKey: ['user-profile-details', userid],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard/user/${userid}`);
      console.log('User profile details:', response.data);
      return response.data.user;
    },
    enabled: !!userid
  });

  console.log('isLoading:', isLoading);
  console.log('error:', error);
  console.log('profileData:', profileData);

  const { data: galleryData } = useQuery({
    queryKey: ['user-gallery', userid],
    queryFn: async () => {
      try {
        console.log('Fetching gallery for userid:', userid);
        const response = await apiClient.get(`/dashboard/gallery/${userid}`);
        console.log('Gallery API response:', response.data);
        console.log('Gallery array:', response.data.gallery);
        return response.data;
      } catch (error) {
        console.error('Gallery API error:', error);
        return { gallery: [] };
      }
    },
    enabled: !!userid,
    retry: false
  });

  console.log('galleryData:', galleryData);
  console.log('gallery array being passed:', galleryData?.gallery || []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const user = profileData;

  const profileContent = (
    <div className="max-w-7xl mx-auto px-3 py-6">
      <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-primary/60 to-primary"></div>
          <div className="absolute left-6 -bottom-12">
            <div className="rounded-full border-4 border-background overflow-hidden h-24 w-24 bg-background">
              <img 
                src={user?.profilePic || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="absolute right-6 bottom-6 flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/chats', { state: { selectedUserId: userid } })}>
              <MessageSquare className="mr-2 h-4 w-4" /> Message
            </Button>
            <Button variant="secondary" onClick={() => setShowShareModal(true)}>
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
                businessName={userProfileData?.business_name || user?.category || "General"}
                category={userProfileData?.category || user?.category || "General"}
                serviceType={userProfileData?.service_type || "Online & Offline"}
                website={userProfileData?.website || "www.example.com"}
                location={userProfileData?.location || [user?.location_city, user?.location_state].filter(Boolean).join(', ') || "[Address]"}
                isRegistered={true}
                accountStatus={userProfileData?.account_status || 'Public'}
                onEdit={isOwnProfile ? () => {
                  console.log('Setting isEditing to true, isOwnProfile:', isOwnProfile);
                  setIsEditing(true);
                } : undefined}
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
                  <BusinessServicesTab userId={userid} />
                </TabsContent>
                
                <TabsContent value="data" className="mt-0">
                  <BusinessDataTab userId={userid} />
                </TabsContent>
                
                <TabsContent value="gallery" className="mt-0">
                  <BusinessGalleryTab gallery={galleryData?.gallery || []} isOwnProfile={isOwnProfile} userId={userid} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSave = async (updatedData: any) => {
    try {
      await apiClient.put('/dashboard/update-profile', updatedData);
      queryClient.invalidateQueries({ queryKey: ['public-profile', userid] });
      queryClient.invalidateQueries({ queryKey: ['user-profile-details', userid] });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isOwnProfile) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto">
            {profileContent}
          </div>
        </div>
        {isEditing && (
          <BusinessEditModal 
            isOpen={isEditing}
            onClose={() => {
              console.log('Closing modal');
              setIsEditing(false);
            }}
            onSave={handleSave}
            initialData={{
              business_name: userProfileData?.business_name || user?.category,
              category: userProfileData?.category || user?.category,
              business_status: userProfileData?.business_status || 'Registered',
              service_type: userProfileData?.service_type || 'Online & Offline',
              website: userProfileData?.website || 'www.example.com',
              location: userProfileData?.location || [user?.location_city, user?.location_state].filter(Boolean).join(', '),
              price_range: userProfileData?.price_range || '₹5,000 - ₹50,000',
              account_status: userProfileData?.account_status || 'Public'
            }}
          />
        )}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input value={`${window.location.origin}/profile/${userid}`} readOnly className="flex-1" />
                <Button onClick={handleCopyLink}>{copied ? 'Copied!' : 'Copy'}</Button>
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('whatsapp')} title="WhatsApp">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('facebook')} title="Facebook">
                  <Facebook className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('instagram')} title="Instagram">
                  <Instagram className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('twitter')} title="Twitter">
                  <Twitter className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('telegram')} title="Telegram">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('linkedin')} title="LinkedIn">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('snapchat')} title="Snapchat">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('reddit')} title="Reddit">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {profileContent}
      {isEditing && (
        <BusinessEditModal 
          isOpen={isEditing}
          onClose={() => {
            console.log('Closing modal');
            setIsEditing(false);
          }}
          onSave={handleSave}
          initialData={{
            business_name: userProfileData?.business_name || user?.category,
            category: userProfileData?.category || user?.category,
            business_status: userProfileData?.business_status || 'Registered',
            service_type: userProfileData?.service_type || 'Online & Offline',
            website: userProfileData?.website || 'www.example.com',
            location: userProfileData?.location || [user?.location_city, user?.location_state].filter(Boolean).join(', '),
            price_range: userProfileData?.price_range || '₹5,000 - ₹50,000',
            account_status: userProfileData?.account_status || 'Public'
          }}
        />
      )}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4 justify-center">
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('whatsapp')}>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('facebook')}>
                <Facebook className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('twitter')}>
                <Twitter className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => handleShare('linkedin')}>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input value={`${window.location.origin}/profile/${userid}`} readOnly className="flex-1" />
              <Button onClick={handleCopyLink}>{copied ? 'Copied!' : 'Copy'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicProfilePage;
