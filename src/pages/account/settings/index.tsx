import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, User, Lock, Bell, Globe, Shield, LogOut, Instagram, Facebook, Youtube, Twitter, Link, X, Info, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string>('business');
  const [showPassword, setShowPassword] = useState(false);
  const [autoScheduling, setAutoScheduling] = useState(false);
  const [socialMediaModal, setSocialMediaModal] = useState<{
    isOpen: boolean;
    platform: string;
    isSaving: boolean;
  }>({
    isOpen: false,
    platform: '',
    isSaving: false
  });
  
  const [syncingPlatform, setSyncingPlatform] = useState<string>('');
  
  const [modalFormData, setModalFormData] = useState({
    url: '',
    preferredDays: [] as string[],
    fromTime: '',
    toTime: ''
  });
  
  const [socialMediaSettings, setSocialMediaSettings] = useState<{
    [key: string]: {
      url: string;
      preferredDays: string[];
      fromTime: string;
      toTime: string;
    }
  }>({
    instagram: { url: '', preferredDays: [], fromTime: '', toTime: '' },
    facebook: { url: '', preferredDays: [], fromTime: '', toTime: '' },
    youtube: { url: '', preferredDays: [], fromTime: '', toTime: '' },
    twitter: { url: '', preferredDays: [], fromTime: '', toTime: '' }
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    originalEmail: '',
    otp: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: true,
      sms: false,
      browser: true
    },
    privacy: {
      profileVisibility: 'public',
      messagePermission: 'followers',
      dataSharing: true
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      youtube: '',
      twitter: ''
    }
  });
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeoutEnabled: false
  });
  useEffect(() => {
    const checkUser = async () => {
      const userId = localStorage.getItem('userId');
      const userType = localStorage.getItem('userType');
      const authToken = localStorage.getItem('authToken');
      
      if (!userId || !authToken) {
        navigate('/signin');
        return;
      }
      
      if (userType) {
        setUserType(userType);
      }

      // Fetch security settings
      fetchSecuritySettings();
      
      // Fetch notification settings
      fetchNotificationSettings();

      // Get user data from localStorage
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          fullName: parsedUser.fullname || '',
          email: parsedUser.email || '',
          originalEmail: parsedUser.email || ''
        }));
        
        // Fetch social connection status
        fetchSocialStatus(parsedUser.email);
      }
      
      // Check for OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const socialStatus = urlParams.get('social');
      const platform = urlParams.get('platform');
      
      if (socialStatus === 'success' && platform) {
        toast.success(`Successfully connected to ${platform}`);
        // Clean URL
        window.history.replaceState({}, '', '/dashboard/settings');
        // Refresh social status
        if (userData) {
          const parsedUser = JSON.parse(userData);
          fetchSocialStatus(parsedUser.email);
        }
      }
      
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  const fetchSecuritySettings = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/dashboard/security-settings', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setSecuritySettings({
          twoFactorEnabled: data.settings.two_factor_enabled || false,
          sessionTimeoutEnabled: data.settings.session_timeout_enabled || false
        });
      }
    } catch (error) {
      console.error('Error fetching security settings:', error);
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/dashboard/notification-settings', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      
      if (data.success && data.settings) {
        setFormData(prev => ({
          ...prev,
          notifications: {
            email: data.settings.email ?? true,
            push: data.settings.push ?? true,
            sms: data.settings.sms ?? false,
            browser: data.settings.browser ?? true
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const handleSecuritySettingChange = async (setting: string, value: boolean) => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/dashboard/security-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          twoFactorEnabled: setting === 'twoFactor' ? value : securitySettings.twoFactorEnabled,
          sessionTimeoutEnabled: setting === 'sessionTimeout' ? value : securitySettings.sessionTimeoutEnabled
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSecuritySettings(prev => ({
          ...prev,
          [setting === 'twoFactor' ? 'twoFactorEnabled' : 'sessionTimeoutEnabled']: value
        }));
        toast.success(`${setting === 'twoFactor' ? 'Two-Factor Authentication' : 'Session Timeout'} ${value ? 'enabled' : 'disabled'}`);
      } else {
        toast.error(data.message || 'Failed to update security settings');
      }
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast.error('Failed to update security settings');
    }
  };

  const fetchSocialStatus = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/connect/status/${email}`);
      const data = await response.json();
      console.log('Social status API response:', data);
      
      // API returns object with platform keys directly
      const updatedSettings: any = {
        instagram: { 
          url: data.instagram?.profile_url || '', 
          preferredDays: data.instagram?.preferred_days || [], 
          fromTime: data.instagram?.preferred_time_from || '', 
          toTime: data.instagram?.preferred_time_to || '', 
          connected: data.instagram?.connected || false 
        },
        facebook: { 
          url: data.facebook?.profile_url || '', 
          preferredDays: data.facebook?.preferred_days || [], 
          fromTime: data.facebook?.preferred_time_from || '', 
          toTime: data.facebook?.preferred_time_to || '', 
          connected: data.facebook?.connected || false 
        },
        youtube: { 
          url: data.youtube?.profile_url || '', 
          preferredDays: data.youtube?.preferred_days || [], 
          fromTime: data.youtube?.preferred_time_from || '', 
          toTime: data.youtube?.preferred_time_to || '', 
          connected: data.youtube?.connected || false 
        },
        twitter: { 
          url: data.twitter?.profile_url || '', 
          preferredDays: data.twitter?.preferred_days || [], 
          fromTime: data.twitter?.preferred_time_from || '', 
          toTime: data.twitter?.preferred_time_to || '', 
          connected: data.twitter?.connected || false 
        }
      };
      
      console.log('Updated settings:', updatedSettings);
      setSocialMediaSettings(updatedSettings);
    } catch (error) {
      console.error('Error fetching social status:', error);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };
  // Modal functions
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute} ${ampm}`;
  });

  const dayOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const openEditModal = (platform: string) => {
    const settings = socialMediaSettings[platform];
    setModalFormData({
      url: settings.url || '',
      preferredDays: settings.preferredDays || [],
      fromTime: settings.fromTime || '',
      toTime: settings.toTime || ''
    });
    setSocialMediaModal({ isOpen: true, platform, isSaving: false });
  };

  const closeModal = () => {
    setSocialMediaModal({ isOpen: false, platform: '', isSaving: false });
    setModalFormData({ url: '', preferredDays: [], fromTime: '', toTime: '' });
  };

  const handleSyncContent = async (platform: string) => {
    const userData = localStorage.getItem('userData');
    const userEmail = userData ? JSON.parse(userData).email : '';
    
    setSyncingPlatform(platform);
    
    try {
      const response = await fetch('http://localhost:3001/api/sync/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          platform
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} content synced successfully! ${data.count} posts synced.`);
      } else {
        toast.error('Failed to sync content');
      }
    } catch (error) {
      console.error('Error syncing content:', error);
      toast.error('Failed to sync content');
    } finally {
      setSyncingPlatform('');
    }
  };

  const handleModalSave = async () => {
    const userData = localStorage.getItem('userData');
    const userId = userData ? JSON.parse(userData).email : '';
    
    setSocialMediaModal(prev => ({ ...prev, isSaving: true }));
    
    try {
      await fetch('http://localhost:3001/api/connect/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          platform: socialMediaModal.platform,
          preferredDays: modalFormData.preferredDays,
          fromTime: modalFormData.fromTime,
          toTime: modalFormData.toTime
        })
      });
      
      setSocialMediaSettings(prev => ({
        ...prev,
        [socialMediaModal.platform]: {
          ...prev[socialMediaModal.platform],
          preferredDays: modalFormData.preferredDays,
          fromTime: modalFormData.fromTime,
          toTime: modalFormData.toTime
        }
      }));
      
      toast.success(`${socialMediaModal.platform.charAt(0).toUpperCase() + socialMediaModal.platform.slice(1)} settings updated successfully`);
      closeModal();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSocialMediaModal(prev => ({ ...prev, isSaving: false }));
    }
  };

  const handleDayToggle = (day: string) => {
    setModalFormData(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day]
    }));
  };
  const handleConnectSocialMedia = (platform: string) => {
    const userData = localStorage.getItem('userData');
    const userId = userData ? JSON.parse(userData).email : '';
    const authUrls: { [key: string]: string } = {
      instagram: `http://localhost:3001/api/auth/instagram?userId=${userId}`,
      facebook: `http://localhost:3001/api/connect/auth/facebook?userId=${userId}`,
      youtube: `http://localhost:3001/api/connect/auth/google?userId=${userId}`,
      twitter: `http://localhost:3001/api/auth/twitter?userId=${userId}`
    };
    
    window.open(authUrls[platform], '_self');
  };
  const handleToggleAutoScheduling = (checked: boolean) => {
    setAutoScheduling(checked);
    toast.success(`Auto scheduling ${checked ? 'enabled' : 'disabled'}`);
  };
  
  const handleDisconnect = async (platform: string) => {
    const userData = localStorage.getItem('userData');
    const userId = userData ? JSON.parse(userData).email : '';
    
    try {
      await fetch('http://localhost:3001/api/connect/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, platform })
      });
      
      toast.success(`Disconnected from ${platform}`);
      
      // Refresh social status
      if (userData) {
        const parsedUser = JSON.parse(userData);
        fetchSocialStatus(parsedUser.email);
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Failed to disconnect');
    }
  };
  const handleNotificationChange = async (name: string, checked: boolean) => {
    const updatedNotifications = {
      ...formData.notifications,
      [name]: checked
    };
    
    setFormData(prev => ({
      ...prev,
      notifications: updatedNotifications
    }));
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/dashboard/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updatedNotifications)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Notification settings updated');
      } else {
        toast.error(data.message || 'Failed to update notification settings');
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    }
  };
  const handlePrivacyChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [name]: value
      }
    }));
  };
  const handleSendOTP = async () => {
    if (!formData.email || formData.email === formData.originalEmail) {
      toast.error('Please enter a new email address');
      return;
    }
    
    setIsSendingOTP(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/dashboard/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.originalEmail })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOtpSent(true);
        toast.success('OTP sent to your current email');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailChanged = formData.email !== formData.originalEmail;
    
    if (emailChanged && !formData.otp) {
      toast.error('Please enter OTP to change email');
      return;
    }
    
    setIsUpdatingProfile(true);
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/dashboard/update-user-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          fullname: formData.fullName,
          email: emailChanged ? formData.email : undefined,
          otp: emailChanged ? formData.otp : undefined
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          parsedUser.fullname = formData.fullName;
          if (emailChanged) {
            parsedUser.email = formData.email;
          }
          localStorage.setItem('userData', JSON.stringify(parsedUser));
        }
        
        setFormData(prev => ({ ...prev, originalEmail: formData.email, otp: '' }));
        setOtpSent(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (!formData.currentPassword || !formData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/dashboard/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        toast.success('Password updated successfully');
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };
  const handleLogout = async () => {
    try {
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      navigate('/signin');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };
  if (loading) {
    return <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>;
  }
  return <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account preferences and settings</p>
            </div>
            <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="social-media" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Social Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Your email address" />
                      {formData.email !== formData.originalEmail && (
                        <div className="space-y-2">
                          <Button type="button" variant="outline" onClick={handleSendOTP} disabled={isSendingOTP} className="w-full">
                            {isSendingOTP ? 'Sending OTP...' : otpSent ? 'Resend OTP' : 'Send OTP to Current Email'}
                          </Button>
                          {otpSent && (
                            <div className="space-y-2">
                              <Label htmlFor="otp">Enter OTP</Label>
                              <Input id="otp" name="otp" value={formData.otp} onChange={handleInputChange} placeholder="Enter OTP sent to your current email" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userType">Account Type</Label>
                      <Input id="userType" value={userType.charAt(0).toUpperCase() + userType.slice(1)} readOnly disabled />
                    </div>
                    <Button type="submit" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                
                
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input id="currentPassword" name="currentPassword" type={showPassword ? "text" : "password"} value={formData.currentPassword} onChange={handleInputChange} placeholder="Enter your current password" />
                        <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" name="newPassword" type="password" value={formData.newPassword} onChange={handleInputChange} placeholder="Enter your new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your new password" />
                    </div>
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch 
                      id="twoFactor" 
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={(checked) => handleSecuritySettingChange('twoFactor', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sessionTimeout">Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out after inactivity
                      </p>
                    </div>
                    <Switch 
                      id="sessionTimeout" 
                      checked={securitySettings.sessionTimeoutEnabled}
                      onCheckedChange={(checked) => handleSecuritySettingChange('sessionTimeout', checked)}
                    />
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      View Account Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch id="emailNotifications" checked={formData.notifications.email} onCheckedChange={checked => handleNotificationChange('email', checked)} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your devices
                      </p>
                    </div>
                    <Switch id="pushNotifications" checked={formData.notifications.push} onCheckedChange={checked => handleNotificationChange('push', checked)} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive text messages for important updates
                      </p>
                    </div>
                    <Switch id="smsNotifications" checked={formData.notifications.sms} onCheckedChange={checked => handleNotificationChange('sms', checked)} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="browserNotifications">Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notifications in your browser
                      </p>
                    </div>
                    <Switch id="browserNotifications" checked={formData.notifications.browser} onCheckedChange={checked => handleNotificationChange('browser', checked)} />
                  </div>
                  
                  <Button className="mt-4" onClick={() => toast.success('Notification settings saved')}>Save Notification Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social-media" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Social Media Profiles</CardTitle>
                      <CardDescription>
                        Connect your social media accounts
                      </CardDescription>
                    </div>
                    {userType === 'influencer' && <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Auto Scheduling</span>
                        <Switch checked={autoScheduling} onCheckedChange={handleToggleAutoScheduling} aria-label="Toggle auto scheduling" />
                      </div>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    {/* Instagram */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
                          <Instagram className="h-6 w-6 text-pink-500" />
                        </div>
                        <div className="flex-1">
                          <Input 
                            value={socialMediaSettings.instagram.connected ? socialMediaSettings.instagram.url : 'No URL set yet'} 
                            readOnly 
                            className="bg-gray-50" 
                            placeholder="No URL / Timing set yet"
                          />
                        </div>
                        <div className="flex gap-2">
                          {socialMediaSettings.instagram.connected ? (
                            <>
                              <Button variant="secondary" onClick={() => handleSyncContent('instagram')} disabled={syncingPlatform === 'instagram'} className="flex items-center gap-1">
                                {syncingPlatform === 'instagram' ? 'Syncing...' : 'Sync'}
                              </Button>
                              <Button variant="destructive" onClick={() => handleDisconnect('instagram')} className="flex items-center gap-1">
                                <X className="h-4 w-4" />
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <Button variant="secondary" onClick={() => handleConnectSocialMedia('instagram')} className="flex items-center gap-1">
                              <Link className="h-4 w-4" />
                              Connect
                            </Button>
                          )}
                          <Button variant="outline" onClick={() => openEditModal('instagram')}>
                            Edit
                          </Button>
                        </div>
                      </div>
                      {(socialMediaSettings.instagram.preferredDays.length > 0 || socialMediaSettings.instagram.fromTime) && (
                        <div className="flex flex-wrap gap-2">
                          {socialMediaSettings.instagram.preferredDays.map(day => (
                            <Badge key={day} variant="secondary">{day.slice(0, 3)}</Badge>
                          ))}
                          {socialMediaSettings.instagram.fromTime && socialMediaSettings.instagram.toTime && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {socialMediaSettings.instagram.fromTime} - {socialMediaSettings.instagram.toTime}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Facebook */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <Facebook className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <Input 
                            value={socialMediaSettings.facebook.connected ? socialMediaSettings.facebook.url : 'No URL set yet'} 
                            readOnly 
                            className="bg-gray-50" 
                            placeholder="No URL / Timing set yet"
                          />
                        </div>
                        <div className="flex gap-2">
                          {socialMediaSettings.facebook.connected ? (
                            <>
                              <Button variant="secondary" onClick={() => handleSyncContent('facebook')} disabled={syncingPlatform === 'facebook'} className="flex items-center gap-1">
                                {syncingPlatform === 'facebook' ? 'Syncing...' : 'Sync'}
                              </Button>
                              <Button variant="destructive" onClick={() => handleDisconnect('facebook')} className="flex items-center gap-1">
                                <X className="h-4 w-4" />
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <Button variant="secondary" onClick={() => handleConnectSocialMedia('facebook')} className="flex items-center gap-1">
                              <Link className="h-4 w-4" />
                              Connect
                            </Button>
                          )}
                          <Button variant="outline" onClick={() => openEditModal('facebook')}>
                            Edit
                          </Button>
                        </div>
                      </div>
                      {(socialMediaSettings.facebook.preferredDays.length > 0 || socialMediaSettings.facebook.fromTime) && (
                        <div className="flex flex-wrap gap-2">
                          {socialMediaSettings.facebook.preferredDays.map(day => (
                            <Badge key={day} variant="secondary">{day.slice(0, 3)}</Badge>
                          ))}
                          {socialMediaSettings.facebook.fromTime && socialMediaSettings.facebook.toTime && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {socialMediaSettings.facebook.fromTime} - {socialMediaSettings.facebook.toTime}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* YouTube */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                          <Youtube className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <Input 
                            value={socialMediaSettings.youtube.connected ? socialMediaSettings.youtube.url : 'No URL set yet'} 
                            readOnly 
                            className="bg-gray-50" 
                            placeholder="No URL / Timing set yet"
                          />
                        </div>
                        <div className="flex gap-2">
                          {socialMediaSettings.youtube.connected ? (
                            <>
                              <Button variant="secondary" onClick={() => handleSyncContent('youtube')} disabled={syncingPlatform === 'youtube'} className="flex items-center gap-1">
                                {syncingPlatform === 'youtube' ? 'Syncing...' : 'Sync'}
                              </Button>
                              <Button variant="destructive" onClick={() => handleDisconnect('youtube')} className="flex items-center gap-1">
                                <X className="h-4 w-4" />
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <Button variant="secondary" onClick={() => handleConnectSocialMedia('youtube')} className="flex items-center gap-1">
                              <Link className="h-4 w-4" />
                              Connect
                            </Button>
                          )}
                          <Button variant="outline" onClick={() => openEditModal('youtube')}>
                            Edit
                          </Button>
                        </div>
                      </div>
                      {(socialMediaSettings.youtube.preferredDays.length > 0 || socialMediaSettings.youtube.fromTime) && (
                        <div className="flex flex-wrap gap-2">
                          {socialMediaSettings.youtube.preferredDays.map(day => (
                            <Badge key={day} variant="secondary">{day.slice(0, 3)}</Badge>
                          ))}
                          {socialMediaSettings.youtube.fromTime && socialMediaSettings.youtube.toTime && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {socialMediaSettings.youtube.fromTime} - {socialMediaSettings.youtube.toTime}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Twitter */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <Twitter className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <Input 
                            value={socialMediaSettings.twitter.connected ? socialMediaSettings.twitter.url : 'No URL set yet'} 
                            readOnly 
                            className="bg-gray-50" 
                            placeholder="No URL / Timing set yet"
                          />
                        </div>
                        <div className="flex gap-2">
                          {socialMediaSettings.twitter.connected ? (
                            <>
                              <Button variant="secondary" onClick={() => handleSyncContent('twitter')} disabled={syncingPlatform === 'twitter'} className="flex items-center gap-1">
                                {syncingPlatform === 'twitter' ? 'Syncing...' : 'Sync'}
                              </Button>
                              <Button variant="destructive" onClick={() => handleDisconnect('twitter')} className="flex items-center gap-1">
                                <X className="h-4 w-4" />
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <Button variant="secondary" onClick={() => handleConnectSocialMedia('twitter')} className="flex items-center gap-1">
                              <Link className="h-4 w-4" />
                              Connect
                            </Button>
                          )}
                          <Button variant="outline" onClick={() => openEditModal('twitter')}>
                            Edit
                          </Button>
                        </div>
                      </div>
                      {(socialMediaSettings.twitter.preferredDays.length > 0 || socialMediaSettings.twitter.fromTime) && (
                        <div className="flex flex-wrap gap-2">
                          {socialMediaSettings.twitter.preferredDays.map(day => (
                            <Badge key={day} variant="secondary">{day.slice(0, 3)}</Badge>
                          ))}
                          {socialMediaSettings.twitter.fromTime && socialMediaSettings.twitter.toTime && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {socialMediaSettings.twitter.fromTime} - {socialMediaSettings.twitter.toTime}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Edit Social Media Modal */}
              <Dialog open={socialMediaModal.isOpen} onOpenChange={closeModal}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      Edit Social Media Settings 
                      <span className="capitalize">({socialMediaModal.platform})</span>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Profile URL */}
                    <div className="space-y-2">
                      <Label htmlFor="profileUrl">Profile URL</Label>
                      <Input
                        id="profileUrl"
                        value={modalFormData.url}
                        readOnly
                        disabled
                        className="bg-gray-50"
                        placeholder={`Connect ${socialMediaModal.platform} to set URL`}
                      />
                    </div>
                    
                    {/* Preferred Days */}
                    <div className="space-y-3">
                      <Label>Preferred Days</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {dayOptions.map(day => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={day}
                              checked={modalFormData.preferredDays.includes(day)}
                              onCheckedChange={() => handleDayToggle(day)}
                            />
                            <Label htmlFor={day} className="text-sm">{day}</Label>
                          </div>
                        ))}
                      </div>
                      {modalFormData.preferredDays.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {modalFormData.preferredDays.map(day => (
                            <Badge key={day} variant="secondary">{day.slice(0, 3)}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Preferred Time */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label>Preferred Time</Label>
                        <Info className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-muted-foreground">Used for Auto Scheduling (IST)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="fromTime" className="text-sm">From Time</Label>
                          <Select value={modalFormData.fromTime} onValueChange={(value) => setModalFormData(prev => ({ ...prev, fromTime: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="toTime" className="text-sm">To Time</Label>
                          <Select value={modalFormData.toTime} onValueChange={(value) => setModalFormData(prev => ({ ...prev, toTime: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {modalFormData.fromTime && modalFormData.toTime && (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Clock className="h-3 w-3" />
                          {modalFormData.fromTime} - {modalFormData.toTime}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={closeModal} disabled={socialMediaModal.isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleModalSave} disabled={socialMediaModal.isSaving}>
                      {socialMediaModal.isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </div>
        </div>
      </div>
    </div>;
};
export default Settings;