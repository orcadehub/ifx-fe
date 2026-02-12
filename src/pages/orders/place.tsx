

import React, { useState, useMemo, useCallback, useRef } from "react";
import { Instagram, Facebook, Youtube, Twitter, Clock, ArrowLeft, FileText, Loader2 } from "lucide-react";
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import DateTimePicker from "@/components/reach/DateTimePicker";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createOrder } from '@/lib/orders-api';

// Import new components
import InfluencerProfileCard from '@/components/orders/place/InfluencerProfileCard';
import OrderTypeSelector from '@/components/orders/place/OrderTypeSelector';
import FileUploader from '@/components/orders/place/FileUploader';
import ContentDescriptionInput from '@/components/orders/place/ContentDescriptionInput';
import DescriptionInput from '@/components/orders/place/DescriptionInput';
import CouponSection from '@/components/orders/place/CouponSection';
import OrderSummary from '@/components/orders/place/OrderSummary';
import UploadFilesTab from '@/components/orders/place/UploadFilesTab';
import ProvideContentTab from '@/components/orders/place/ProvideContentTab';
import VisitPromoteTab from '@/components/orders/place/VisitPromoteTab';
import PollContentTab from '@/components/orders/place/PollContentTab';

const formatFollowers = (num: number) => {
  if (!num || num === 0) return '0';
  if (num >= 1000000000000) return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

const influencerMock = {
  avatar: "https://picsum.photos/id/64/100/100",
  name: "Gary Vaynerchuk",
  category: "Digital Marketing",
  location: "New York, USA",
  followers: [
    { platform: "Instagram", icon: <Instagram className="text-social-instagram w-5 h-5" />, value: "2.3M" },
    { platform: "Facebook", icon: <Facebook className="text-social-facebook w-5 h-5" />, value: "834K" },
    { platform: "YouTube", icon: <Youtube className="text-social-youtube w-5 h-5" />, value: "569K" },
    { platform: "Twitter", icon: <Twitter className="text-social-twitter w-5 h-5" />, value: "3.4M" },
  ],
};

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'text-pink-500' },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'text-blue-600' },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: 'text-red-500' },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: 'text-blue-400' },
];

const availableCoupons = {
  "WELCOME10": { discount: 80, type: "fixed" },
  "NEWYEAR25": { discount: 200, type: "fixed" },
  "SAVE15": { discount: 15, type: "percentage" },
};

const contentTypesByOrder = {
  "Platform Based": [
    "Post Image/Video",
    "Reels/Shorts", 
    "Story (Image/Video)",
    "In-Video Promotion (<10 min)",
    "Promotions (>10 min)",
    "Polls",
    "Visit & Promote"
  ],
  "Custom Package": [
    "In-Video Promotion",
    "Promotion", 
    "Visit and Promotion"
  ]
};

// Dynamic suggestions based on description content
const generateDynamicHashtags = (text: string) => {
  const keywords = text.toLowerCase().split(/\s+/);
  const trendingHashtags = ["#trending", "#viral", "#fashion", "#lifestyle", "#brand", "#giveaway", "#sale", "#new", "#exclusive", "#limited"];
  
  // Filter hashtags based on content relevance
  return trendingHashtags.filter(tag => {
    const tagWord = tag.substring(1);
    return keywords.some(word => word.includes(tagWord) || tagWord.includes(word)) || 
           Math.random() > 0.6; // Add some randomness for trending tags
  }).slice(0, 5);
};

const businessProfiles = [
  { handle: "@brandname", platform: "instagram", icon: <Instagram className="w-4 h-4 text-pink-500" /> },
  { handle: "@companyofficial", platform: "facebook", icon: <Facebook className="w-4 h-4 text-blue-600" /> },
  { handle: "@yourstore", platform: "youtube", icon: <Youtube className="w-4 h-4 text-red-500" /> },
  { handle: "@businessofficial", platform: "twitter", icon: <Twitter className="w-4 h-4 text-blue-400" /> },
];

const generateContextualEmojis = (text: string) => {
  const lowerText = text.toLowerCase();
  const emojiMap = {
    'sale': ['🛍️', '💰', '🏷️'],
    'new': ['✨', '🆕', '🎉'],
    'fashion': ['👗', '💄', '👠'],
    'food': ['🍕', '🍰', '🥗'],
    'tech': ['📱', '💻', '⚡'],
    'fitness': ['💪', '🏃‍♀️', '🏋️'],
    'travel': ['✈️', '🌍', '📸'],
    'beauty': ['💄', '✨', '💅'],
    'love': ['❤️', '💖', '😍'],
  };
  
  let contextualEmojis = [];
  for (const [keyword, emojis] of Object.entries(emojiMap)) {
    if (lowerText.includes(keyword)) {
      contextualEmojis.push(...emojis);
    }
  }
  
  // Add general popular emojis
  const popularEmojis = ["🔥", "✨", "💯", "🎉", "👑", "💖"];
  contextualEmojis.push(...popularEmojis);
  
  return [...new Set(contextualEmojis)].slice(0, 6);
};

export default function PlaceOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get influencer data from navigation state
  const influencerData = location.state?.selected || null;
  
  // Format influencer data for display
  const influencer = influencerData ? {
    id: influencerData.id,
    wishlist: influencerData.wishlist,
    avatar: influencerData.profilePic || influencerData.profile_pic || `https://picsum.photos/seed/${influencerData.id}/100`,
    name: influencerData.name,
    category: influencerData.category,
    location: `${influencerData.location_city || ''}, ${influencerData.location_state || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'Location not specified',
    followers: [
      { platform: "Instagram", icon: <Instagram className="text-social-instagram w-5 h-5" />, value: formatFollowers(influencerData.data?.instagram?.total_followers || 0) },
      { platform: "Facebook", icon: <Facebook className="text-social-facebook w-5 h-5" />, value: formatFollowers(influencerData.data?.facebook?.total_followers || 0) },
      { platform: "YouTube", icon: <Youtube className="text-social-youtube w-5 h-5" />, value: formatFollowers(influencerData.data?.youtube?.total_followers || 0) },
      { platform: "Twitter", icon: <Twitter className="text-social-twitter w-5 h-5" />, value: formatFollowers(influencerData.data?.twitter?.total_followers || 0) },
    ],
  } : influencerMock;

  // Get pricing from influencer data
  const getInfluencerPrice = () => {
    if (!influencerData?.pricing) return 0;
    
    // Try to get price for selected platform and content type
    const platformPricing = influencerData.pricing[selectedSinglePlatform];
    if (platformPricing) {
      // Try to match content type to pricing keys
      const contentKey = Object.keys(platformPricing).find(key => 
        key.toLowerCase().includes(selectedContent.toLowerCase().split(' ')[0])
      );
      if (contentKey) {
        const price = platformPricing[contentKey];
        return Number(String(price).replace(/[^0-9.]/g, '')) || 0;
      }
    }
    return 0;
  };
  
  const [affiliateLink, setAffiliateLink] = useState("");
  const [affiliateLinkError, setAffiliateLinkError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number, type: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  
  // Content description state
  const [contentDescription, setContentDescription] = useState("");
  const [contentDescriptionError, setContentDescriptionError] = useState("");

  // New states for dropdowns
  const [selectedOrderType, setSelectedOrderType] = useState<string>("Platform Based");
  const [selectedContent, setSelectedContent] = useState<string>("Post Image/Video");
  const [selectedSinglePlatform, setSelectedSinglePlatform] = useState<string>("instagram");
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);

  const dropAreaRef = useRef<HTMLDivElement>(null);

  // New state for tabs
  const [activeTab, setActiveTab] = useState("upload-files");
  const [notesDescription, setNotesDescription] = useState("");
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [isUploadingReference, setIsUploadingReference] = useState(false);

  // Dynamic suggestions based on current description
  const dynamicHashtags = useMemo(() => generateDynamicHashtags(description), [description]);
  const contextualEmojis = useMemo(() => generateContextualEmojis(description), [description]);

  const packagePrice = getInfluencerPrice();
  const platformFee = 99;
  
  const couponDiscount = appliedCoupon ? 
    appliedCoupon.type === "percentage" 
      ? Math.round(packagePrice * appliedCoupon.discount / 100) 
      : appliedCoupon.discount 
    : 0;
  
  const total = packagePrice - couponDiscount + platformFee;

  const validateAffiliateLink = (link: string) => {
    // Make affiliate link optional - no validation required if empty
    if (!link.trim()) {
      return "";
    }
    
    try {
      new URL(link);
      return "";
    } catch (e) {
      return "Please enter a valid URL";
    }
  };

  const validateDescription = (message: string) => {
    if (message.length > 500) {
      return "Description must be less than 500 characters";
    }
    return "";
  };

  const validateContentDescription = (description: string) => {
    if (description.length > 500) {
      return "Description must be less than 500 characters";
    }
    return "";
  };

  const handleOrderTypeChange = (orderType: string) => {
    setSelectedOrderType(orderType);
    // Reset content to first option of new order type
    const newContentOptions = contentTypesByOrder[orderType as keyof typeof contentTypesByOrder];
    setSelectedContent(newContentOptions[0]);
  };

  const handleAffiliateLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setAffiliateLink(link);
    setAffiliateLinkError(validateAffiliateLink(link));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = e.target.value;
    setDescription(message);
    setDescriptionError(validateDescription(message));
  };

  const handleContentDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const desc = e.target.value;
    setContentDescription(desc);
    setContentDescriptionError(validateContentDescription(desc));
  };

  const handleAiEnhance = () => {
    setIsAiEnhancing(true);
    // Simulate AI enhancement
    setTimeout(() => {
      const enhancedText = description + " ✨ Enhanced with trending hashtags and engaging content suggestions!";
      setDescription(enhancedText);
      setIsAiEnhancing(false);
      toast({
        title: "AI Enhancement Complete",
        description: "Your description has been enhanced with AI suggestions!",
        variant: "default"
      });
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDescription(prev => prev + (prev ? " " : "") + suggestion);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setTimeout(() => {
        setFiles(Array.from(e.target.files || []));
        setIsUploading(false);
      }, 1000);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("border-primary", "bg-primary/5");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary", "bg-primary/5");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary", "bg-primary/5");
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setIsUploading(true);
      setTimeout(() => {
        setFiles(Array.from(e.dataTransfer.files));
        setIsUploading(false);
      }, 1000);
    }
  };

  const handleReferenceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploadingReference(true);
      setTimeout(() => {
        setReferenceFiles(Array.from(e.target.files || []));
        setIsUploadingReference(false);
      }, 1000);
    }
  };

  const removeReferenceFile = (index: number) => {
    setReferenceFiles(referenceFiles.filter((_, i) => i !== index));
  };

  const handleCouponApply = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }

    const coupon = availableCoupons[couponCode as keyof typeof availableCoupons];
    if (coupon) {
      setAppliedCoupon({
        code: couponCode,
        discount: coupon.discount,
        type: coupon.type
      });
      toast({
        title: "Success",
        description: `Coupon ${couponCode} applied successfully!`,
        variant: "default"
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "This coupon code is not valid",
        variant: "destructive"
      });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed",
      variant: "default"
    });
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const linkError = validateAffiliateLink(affiliateLink);
    const messageError = validateDescription(description);
    const descError = validateContentDescription(contentDescription);
    
    setAffiliateLinkError(linkError);
    setDescriptionError(messageError);
    setContentDescriptionError(descError);
    
    if (linkError || messageError || descError) {
      toast({
        title: "Form Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    // Validate that either content description or files are provided
    if (!contentDescription.trim() && files.length === 0) {
      toast({
        title: "Missing Content",
        description: "Please provide either a content description or upload files",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedDateTime) {
      toast({
        title: "Missing Selection",
        description: "Please select date and time",
        variant: "destructive"
      });
      return;
    }

    if (!influencerData?.id) {
      toast({
        title: "Error",
        description: "Influencer information is missing",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createOrder({
        influencerId: influencerData.id,
        influencer_name: influencerData.name,
        type: selectedOrderType,
        services: [{
          name: selectedContent,
          platform: selectedSinglePlatform,
          price: packagePrice
        }],
        totalPrice: total,
        orderAmount: packagePrice,
        description: activeTab === 'upload-files' ? description : contentDescription,
        affiliatedLinks: affiliateLink ? [affiliateLink] : [],
        couponCode: appliedCoupon?.code,
        postDateTime: selectedDateTime ? format(selectedDateTime, "yyyy-MM-dd'T'HH:mm:ss") : undefined,
        polls: selectedContent === 'Polls' ? [] : undefined,
        visitPromotionData: selectedContent === 'Visit & Promote' ? {} : undefined
      });
      
      setShowThankYouDialog(true);
    } catch (error) {
      console.error('Order creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex-1 flex justify-center px-4 py-4 max-w-7xl mx-auto w-full">
        <div className="w-full flex flex-col gap-6">
          {/* Back Button - positioned above the two-column layout */}
          <Button
            variant="ghost"
            size="sm"
            className="self-start bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Column 1 - Left side */}
            <div className="flex-1 flex flex-col gap-7">
              {/* Influencer Card - aligned to match height of Date & Time section */}
              <div className="flex flex-col gap-6 min-h-[200px]">
                <InfluencerProfileCard influencer={influencer} />
              </div>
              
              <OrderTypeSelector
                selectedOrderType={selectedOrderType}
                selectedContent={selectedContent}
                selectedSinglePlatform={selectedSinglePlatform}
                onOrderTypeChange={handleOrderTypeChange}
                onContentChange={setSelectedContent}
                onPlatformChange={setSelectedSinglePlatform}
                contentTypesByOrder={contentTypesByOrder}
                socialPlatforms={socialPlatforms}
                isCustomPackage={selectedOrderType === "Custom Package"}
              />
              
              {/* Conditional Content Section */}
              {selectedContent === "Visit & Promote" ? (
                <VisitPromoteTab
                  onSendRequest={handleSendRequest}
                  isSubmitting={isSubmitting}
                />
              ) : selectedContent === "Polls" ? (
                <PollContentTab
                  onSendRequest={handleSendRequest}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <div className="space-y-6">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary/80" />
                    How would you like to provide the content?
                  </Label>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload-files">Upload Files</TabsTrigger>
                      <TabsTrigger value="provide-content">Provide Content</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload-files" className="space-y-6 mt-6">
                      <UploadFilesTab
                        description={description}
                        descriptionError={descriptionError}
                        isAiEnhancing={isAiEnhancing}
                        dynamicHashtags={dynamicHashtags}
                        businessProfiles={businessProfiles}
                        contextualEmojis={contextualEmojis}
                        files={files}
                        isUploading={isUploading}
                        notesDescription={notesDescription}
                        onDescriptionChange={handleDescriptionChange}
                        onDescriptionBlur={() => setDescriptionError(validateDescription(description))}
                        onAiEnhance={handleAiEnhance}
                        onSuggestionClick={handleSuggestionClick}
                        onFileChange={handleFileChange}
                        onRemoveFile={removeFile}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onNotesChange={(e) => setNotesDescription(e.target.value)}
                      />
                    </TabsContent>
                    
                    <TabsContent value="provide-content" className="space-y-6 mt-6">
                      <ProvideContentTab
                        contentDescription={contentDescription}
                        contentDescriptionError={contentDescriptionError}
                        referenceFiles={referenceFiles}
                        isUploadingReference={isUploadingReference}
                        onContentDescriptionChange={handleContentDescriptionChange}
                        onContentDescriptionBlur={() => setContentDescriptionError(validateContentDescription(contentDescription))}
                        onReferenceFileChange={handleReferenceFileChange}
                        onRemoveReferenceFile={removeReferenceFile}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
            
            {/* Column 2 - Right side */}
            <div className="flex-1 flex flex-col gap-6">
              {selectedContent === "Visit & Promote" ? (
                <>
                  {/* Date & Time section for Visit & Promote */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary/80" />
                        Schedule Post - Select Date & Time
                      </Label>
                      
                      <DateTimePicker
                        value={selectedDateTime}
                        onChange={setSelectedDateTime}
                        label=""
                        placeholder="Pick a date and time"
                      />
                    </div>
                  </div>

                  {/* Affiliate Link section for Visit & Promote */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <Label 
                      htmlFor="affiliate-link" 
                      className={cn(
                        "text-sm mb-1.5 block",
                        affiliateLinkError && "text-destructive"
                      )}
                    >
                      Affiliate Link (Optional) {affiliateLinkError && `(${affiliateLinkError})`}
                    </Label>
                    <Input
                      id="affiliate-link"
                      placeholder="https://example.com/your-affiliate-link"
                      className={cn(
                        "transition-all focus-visible:ring-primary",
                        affiliateLinkError && "border-destructive focus-visible:ring-destructive"
                      )}
                      value={affiliateLink}
                      onChange={handleAffiliateLinkChange}
                      onBlur={() => setAffiliateLinkError(validateAffiliateLink(affiliateLink))}
                    />
                  </div>

                  {/* Coupon Section for Visit & Promote */}
                  <CouponSection
                    couponCode={couponCode}
                    appliedCoupon={appliedCoupon}
                    onCouponCodeChange={setCouponCode}
                    onCouponApply={handleCouponApply}
                    onRemoveCoupon={removeCoupon}
                  />

                  {/* Order Summary for Visit & Promote */}
                  <div className="bg-white border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Order Details</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium text-foreground">{selectedOrderType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Content:</span>
                          <span className="font-medium text-foreground">{selectedContent}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Platform:</span>
                          <div className="flex items-center gap-2">
                            {socialPlatforms.find(p => p.id === selectedSinglePlatform)?.icon}
                            <span className="font-medium text-foreground">
                              {socialPlatforms.find(p => p.id === selectedSinglePlatform)?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className={cn(
                          "transition-all",
                          appliedCoupon ? "text-primary" : "text-muted-foreground"
                        )}>
                          Coupon Discount
                        </span>
                        <span className={cn(
                          appliedCoupon ? "text-primary font-medium" : "text-muted-foreground"
                        )}>
                          {couponDiscount ? `−${couponDiscount}₹` : "—"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform Fee</span>
                        <span className="text-muted-foreground">{platformFee}₹</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-base font-semibold">Total</span>
                      <span className="text-xl font-bold">{total}₹</span>
                    </div>
                  </div>

                  {/* Send Request Button for Visit & Promote */}
                  <Button
                    type="button"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all py-6 text-base"
                    onClick={handleSendRequest}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Send Request"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* Date & Time section - aligned to match height of Influencer Card */}
                  <div className="space-y-6 min-h-[200px] flex flex-col justify-center">
                    <div className="space-y-4">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary/80" />
                        Select Date & Time
                      </Label>
                      
                      <DateTimePicker
                        value={selectedDateTime}
                        onChange={setSelectedDateTime}
                        label=""
                        placeholder="Pick a date and time"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-border">
                    <Label 
                      htmlFor="affiliate-link" 
                      className={cn(
                        "text-sm mb-1.5 block",
                        affiliateLinkError && "text-destructive"
                      )}
                    >
                      Affiliate Link (Optional) {affiliateLinkError && `(${affiliateLinkError})`}
                    </Label>
                    <Input
                      id="affiliate-link"
                      placeholder="https://example.com/your-affiliate-link"
                      className={cn(
                        "transition-all focus-visible:ring-primary",
                        affiliateLinkError && "border-destructive focus-visible:ring-destructive"
                      )}
                      value={affiliateLink}
                      onChange={handleAffiliateLinkChange}
                      onBlur={() => setAffiliateLinkError(validateAffiliateLink(affiliateLink))}
                    />
                  </div>
                  
                  <CouponSection
                    couponCode={couponCode}
                    appliedCoupon={appliedCoupon}
                    onCouponCodeChange={setCouponCode}
                    onCouponApply={handleCouponApply}
                    onRemoveCoupon={removeCoupon}
                  />
                  
                  <OrderSummary
                    selectedOrderType={selectedOrderType}
                    selectedContent={selectedContent}
                    selectedSinglePlatform={selectedSinglePlatform}
                    contentSubmissionMethod="upload"
                    packagePrice={packagePrice}
                    platformFee={platformFee}
                    couponDiscount={couponDiscount}
                    appliedCoupon={appliedCoupon}
                    total={total}
                    isSubmitting={isSubmitting}
                    socialPlatforms={socialPlatforms}
                    onPlatformChange={setSelectedSinglePlatform}
                    onSendRequest={handleSendRequest}
                    isCustomPackage={selectedOrderType === "Custom Package"}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialog open={showThankYouDialog} onOpenChange={setShowThankYouDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-center">
              Thank You!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-2">
              <p>Request has been sent to influencer successfully.</p>
              <p>The post will be automatically scheduled and published on the influencer's page.</p>
              <p>Once the posting is completed, you can track the results on the Reach page.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => navigate('/orders')}
            >
              View Orders
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

