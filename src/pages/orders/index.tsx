import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format, parse, isAfter, isBefore, parseISO } from 'date-fns';
import { Order, OrderStatus, OrderContentType, SocialMediaLinks } from '@/types/order';
import { getOrders, updateOrder } from '@/lib/orders-api';
import { getUserServiceRequests } from '@/lib/services-api';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Filter, RefreshCw, Calendar, Clock, FileText, Download, Upload, BarChart, MapPin, Edit, X, ShoppingCart, Instagram, Facebook, Youtube, Twitter, ExternalLink } from 'lucide-react';
import DateTimePicker from '@/components/reach/DateTimePicker';
import FilterDropdown from '@/components/filters/FilterDropdown';

// Define order types
const ORDER_TYPES = [
  { value: 'post', label: 'Post' },
  { value: 'reel', label: 'Reel' },
  { value: 'short_video', label: 'Short Video' },
  { value: 'long_video', label: 'Long Video' },
  { value: 'polls', label: 'Polls' },
  { value: 'combo_package', label: 'Combo Package' }
];

// Define status options
const STATUS_OPTIONS = [
  { value: 'pending_checkout', label: 'Pending' },
  { value: 'completed', label: 'Completed' }
];

const OrdersPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [modifyPrice, setModifyPrice] = useState('');
  const [modifyDate, setModifyDate] = useState('');
  const [modifyTime, setModifyTime] = useState('');
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLinks>({});
  
  // Filter states
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const [ordersData, servicesData] = await Promise.all([
          getOrders(),
          getUserServiceRequests()
        ]);
        
        const transformedOrders: Order[] = ordersData.map((item: any) => ({
          id: item.id,
          orderNumber: item.order_id,
          date: item.created_at,
          url: '',
          status: item.status === 'pending payment' ? 'pending_checkout' : item.status === 'completed' ? 'completed' : 'pending_checkout',
          scheduledDate: item.post_datetime ? format(new Date(item.post_datetime), 'yyyy-MM-dd') : '',
          scheduledTime: item.post_datetime ? format(new Date(item.post_datetime), 'HH:mm') : '',
          category: item.order_type || '',
          productService: item.content_type || '',
          orderType: item.order_type || 'post',
          businessVerified: false,
          username: item.order_direction === 'sent' ? item.influencer_user_name : item.user_fullname,
          amount: parseFloat(item.display_amount) || 0,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));

        const transformedServices: Order[] = servicesData.map((item: any) => ({
          id: `service-${item.id}`,
          orderNumber: item.id,
          date: item.created_at,
          url: '',
          status: item.status === 'pending' ? 'pending_checkout' : 'completed',
          scheduledDate: '',
          scheduledTime: '',
          category: 'Service',
          productService: item.service_title,
          orderType: 'service',
          businessVerified: false,
          username: item.full_name,
          amount: parseFloat(item.budget) || 0,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));

        return [...transformedOrders, ...transformedServices];
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        return [];
      }
    },
    refetchOnWindowFocus: false
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, updateData }: { orderId: number; updateData: any }) => 
      updateOrder(orderId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order Modified",
        description: "Order details have been updated successfully.",
      });
      setIsModifyMode(false);
      setIsDetailOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order",
        variant: "destructive",
      });
    }
  });

  const filteredOrders = React.useMemo(() => {
    let filtered = [...orders];

    if (activeTab === 'pending') {
      filtered = filtered.filter(order => order.status === 'pending_checkout');
    } else {
      filtered = filtered.filter(order => order.status === 'completed');
    }

    if (startDate) {
      filtered = filtered.filter(order => {
        const orderDate = parseISO(order.createdAt);
        return isAfter(orderDate, startDate) || orderDate.getTime() === startDate.getTime();
      });
    }

    if (endDate) {
      filtered = filtered.filter(order => {
        const orderDate = parseISO(order.createdAt);
        return isBefore(orderDate, endDate) || orderDate.getTime() === endDate.getTime();
      });
    }

    if (statusFilter && ((statusFilter === 'pending_checkout' && activeTab !== 'pending') || 
        (statusFilter === 'completed' && activeTab !== 'completed'))) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (orderTypeFilter) {
      filtered = filtered.filter(order => order.orderType === orderTypeFilter);
    }

    return filtered;
  }, [orders, activeTab, startDate, endDate, statusFilter, orderTypeFilter]);

  const handleCheckout = (order: Order) => {
    navigate('/checkout', { 
      state: { order }
    });
  };

  const handleReject = (order: Order) => {
    toast({
      title: "Reject Order",
      description: `Rejecting order #${order.orderNumber}`,
      variant: "destructive",
    });
  };

  const handleUpdate = (order: Order) => {
    const updatedOrder = {
      ...order,
      socialMediaLinks: socialMediaLinks,
      updatedAt: new Date().toISOString()
    };
    
    toast({
      title: "Update Order",
      description: `Order #${order.orderNumber} has been updated successfully`,
    });
    setIsDetailOpen(false);
  };

  const handleViewDetails = (order: Order) => {
    if (order.orderType === 'service') {
      return;
    }
    setSelectedOrder(order);
    setSocialMediaLinks(order.socialMediaLinks || {});
    setIsDetailOpen(true);
  };

  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatusFilter('');
    setOrderTypeFilter('');
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy, HH:mm');
    } catch (e) {
      return dateStr || '-';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending_checkout':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Helper functions for content type display
  const getContentTypeIcon = (type: OrderContentType) => {
    switch(type) {
      case 'upload_files':
        return <Upload className="w-4 h-4" />;
      case 'provided_content':
        return <FileText className="w-4 h-4" />;
      case 'polls':
        return <BarChart className="w-4 h-4" />;
      case 'visit_promote':
        return <MapPin className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getContentTypeLabel = (type: OrderContentType) => {
    switch(type) {
      case 'upload_files':
        return 'Uploaded Files';
      case 'provided_content':
        return 'Provided Content';
      case 'polls':
        return 'Poll Details';
      case 'visit_promote':
        return 'Visit & Promote Details';
      default:
        return 'Content';
    }
  };

  // Generate dummy content for testing
  const getDummyContent = (order: Order) => {
    const orderIdNum = parseInt(order.id) || 1;
    const contentTypes: OrderContentType[] = ['upload_files', 'provided_content', 'polls', 'visit_promote'];
    const selectedType = contentTypes[orderIdNum % contentTypes.length];

    switch(selectedType) {
      case 'upload_files':
        return {
          type: 'upload_files' as OrderContentType,
          files: [
            { id: '1', name: 'brand-logo.jpg', type: 'image/jpeg', size: '2.4 MB', url: '#' },
            { id: '2', name: 'product-catalog.pdf', type: 'application/pdf', size: '5.1 MB', url: '#' },
            { id: '3', name: 'content-brief.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '456 KB', url: '#' }
          ]
        };
      case 'provided_content':
        return {
          type: 'provided_content' as OrderContentType,
          description: 'Create engaging content showcasing our new summer collection. Focus on lifestyle shots with natural lighting. Include call-to-action for our seasonal sale (20% off). Target audience: young professionals aged 25-35. Brand tone: trendy, approachable, and sustainable.'
        };
      case 'polls':
        return {
          type: 'polls' as OrderContentType,
          polls: [
            {
              id: '1',
              question: 'What\'s your favorite season for fashion?',
              options: ['Spring', 'Summer', 'Fall', 'Winter']
            },
            {
              id: '2',
              question: 'Which style do you prefer?',
              options: ['Casual', 'Formal', 'Streetwear', 'Bohemian']
            }
          ]
        };
      case 'visit_promote':
        return {
          type: 'visit_promote' as OrderContentType,
          visitDetails: {
            preferredDates: ['2024-03-15', '2024-03-16', '2024-03-17'],
            timeSlot: '10:00 AM - 2:00 PM',
            location: 'Flagship Store, Mumbai - Bandra West, Plot 123, Linking Road',
            offers: {
              food: true,
              travel: true,
              stay: false,
              other: ['Free merchandise worth ₹2000', 'VIP store tour', 'Meet with brand ambassador']
            }
          }
        };
      default:
        return undefined;
    }
  };

  // Mock attached files for demonstration
  const getAttachedFiles = (order: Order) => {
    // In a real app, this would come from the order data
    // For now, we'll simulate some files based on order type
    const mockFiles = [
      { id: '1', name: 'product-image.jpg', type: 'image/jpeg', size: '2.4 MB' },
      { id: '2', name: 'brand-guidelines.pdf', type: 'application/pdf', size: '1.2 MB' },
      { id: '3', name: 'content-brief.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '456 KB' }
    ];
    
    // Return a subset based on order ID to simulate variety
    const orderIdNum = parseInt(order.id) || 1;
    return mockFiles.slice(0, (orderIdNum % 3) + 1);
  };

  const handleModify = () => {
    setIsModifyMode(true);
    if (selectedOrder) {
      setModifyPrice(selectedOrder.amount?.toString() || '');
      setModifyDate(selectedOrder.scheduledDate || '');
      setModifyTime(selectedOrder.scheduledTime || '');
    }
  };

  const handleSaveModification = () => {
    if (!selectedOrder) return;
    
    updateOrderMutation.mutate({
      orderId: selectedOrder.id as number,
      updateData: {
        scheduledDate: modifyDate,
        scheduledTime: modifyTime,
        socialLinks: socialMediaLinks
      }
    });
  };

  const handleCancelModification = () => {
    setIsModifyMode(false);
    setModifyPrice('');
    setModifyDate('');
    setModifyTime('');
  };
  
  const isValidUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return true; // Empty is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSocialMediaLinkChange = (platform: keyof SocialMediaLinks, value: string) => {
    setSocialMediaLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const isInfluencer = localStorage.getItem('userType') === 'influencer';

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <h1 className="text-2xl font-bold">Orders</h1>
              
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(startDate || endDate || statusFilter || orderTypeFilter) && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>
            </div>

            {isFilterOpen && (
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <DateTimePicker 
                    value={startDate} 
                    onChange={setStartDate} 
                    label="From Date"
                    placeholder="Select start date"
                  />
                  
                  <DateTimePicker 
                    value={endDate} 
                    onChange={setEndDate} 
                    label="To Date"
                    placeholder="Select end date"
                  />
                  
                  <div>
                    <FilterDropdown
                      label="Status"
                      placeholder="Select status"
                      value={STATUS_OPTIONS.find(s => s.value === statusFilter)?.label || ''}
                      onClick={() => {
                        const nextStatus = statusFilter === 'pending_checkout' 
                          ? 'completed' 
                          : statusFilter === 'completed' 
                            ? '' 
                            : 'pending_checkout';
                        setStatusFilter(nextStatus);
                      }}
                      onClear={() => setStatusFilter('')}
                    />
                  </div>
                  
                  <div>
                    <FilterDropdown
                      label="Order Type"
                      placeholder="Select type"
                      value={ORDER_TYPES.find(t => t.value === orderTypeFilter)?.label || ''}
                      onClick={() => {
                        const types = ORDER_TYPES.map(t => t.value);
                        const currentIndex = types.indexOf(orderTypeFilter);
                        const nextIndex = currentIndex === types.length - 1 ? -1 : currentIndex + 1;
                        setOrderTypeFilter(nextIndex === -1 ? '' : types[nextIndex]);
                      }}
                      onClear={() => setOrderTypeFilter('')}
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>
              </Card>
            )}
            
            <Tabs 
              defaultValue="pending" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'pending' | 'completed')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="pending">Pending Orders</TabsTrigger>
                <TabsTrigger value="completed">Completed Orders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                {isLoading ? (
                  <div className="w-full h-72 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No pending orders found.</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Scheduled Date</TableHead>
                            <TableHead>Scheduled Time</TableHead>
                            <TableHead>Order Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Product/Service</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => (
                            <TableRow 
                              key={order.id} 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleViewDetails(order)}
                            >
                              <TableCell>{order.username}</TableCell>
                              <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                              <TableCell>{order.scheduledDate || '-'}</TableCell>
                              <TableCell>{order.scheduledTime || '-'}</TableCell>
                              <TableCell>{order.orderType || 'Post'}</TableCell>
                              <TableCell>{order.category || '-'}</TableCell>
                              <TableCell>{order.productService || '-'}</TableCell>
                              <TableCell>₹{order.amount || 0}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(order.status)}>
                                  {order.status === 'pending_checkout' ? 'Pending' : 'Completed'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReject(order);
                                    }}
                                  >
                                    Reject
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCheckout(order);
                                    }}
                                  >
                                    Checkout
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {isLoading ? (
                  <div className="w-full h-72 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No completed orders found.</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Scheduled Date</TableHead>
                            <TableHead>Scheduled Time</TableHead>
                            <TableHead>Order Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Product/Service</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => (
                            <TableRow 
                              key={order.id} 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleViewDetails(order)}
                            >
                              <TableCell>{order.username}</TableCell>
                              <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                              <TableCell>{order.scheduledDate || '-'}</TableCell>
                              <TableCell>{order.scheduledTime || '-'}</TableCell>
                              <TableCell>{order.orderType || 'Post'}</TableCell>
                              <TableCell>{order.category || '-'}</TableCell>
                              <TableCell>{order.productService || '-'}</TableCell>
                              <TableCell>₹{order.amount || 0}</TableCell>
                              <TableCell>
                                <Badge variant="success">Completed</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdate(order);
                                  }}
                                >
                                  Update
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Enhanced Order Details Modal */}
      <Dialog open={isDetailOpen} onOpenChange={(open) => {
        setIsDetailOpen(open);
        if (!open) {
          setIsModifyMode(false);
          setModifyPrice('');
          setModifyDate('');
          setSocialMediaLinks({});
        }
      }}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Order ID:</span>
                      <span>{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                        {selectedOrder.status === 'pending_checkout' ? 'Pending' : 'Completed'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Username:</span>
                      <span>{selectedOrder.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order Type:</span>
                      <span className="capitalize">{selectedOrder.orderType || 'Post'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order Date:</span>
                      <span>{formatDateTime(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Amount:</span>
                      <span className="font-semibold text-lg">₹{selectedOrder.amount || 0}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Schedule & Product</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Scheduled Date:</span>
                      {isModifyMode ? (
                        <Input
                          type="date"
                          value={modifyDate}
                          onChange={(e) => setModifyDate(e.target.value)}
                          className="w-32 h-8"
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      ) : (
                        <span>{selectedOrder.scheduledDate || 'Not scheduled'}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Scheduled Time:</span>
                      {isModifyMode ? (
                        <Input
                          type="time"
                          value={modifyTime}
                          onChange={(e) => setModifyTime(e.target.value)}
                          className="w-32 h-8"
                        />
                      ) : (
                        <span>{selectedOrder.scheduledTime || 'Not set'}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Category:</span>
                      <span>{selectedOrder.category || '-'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Product/Service:</span>
                      <p className="text-sm mt-1 text-muted-foreground">{selectedOrder.productService || '-'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dynamic Content Type Display */}
              {(() => {
                const dummyContent = getDummyContent(selectedOrder);
                const contentType = dummyContent?.type;
                
                // Don't show this section at all
                return null;
              })()}

              {/* Social Media Links Section - Only for completed orders */}
              {selectedOrder.status === 'completed' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Social Media Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Add URLs to the social media posts for this order
                    </p>
                  
                  {/* Instagram */}
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 transition-opacity ${
                      socialMediaLinks.instagram && isValidUrl(socialMediaLinks.instagram) 
                        ? 'opacity-100' 
                        : 'opacity-30'
                    }`}>
                      {socialMediaLinks.instagram && isValidUrl(socialMediaLinks.instagram) ? (
                        <a 
                          href={socialMediaLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:opacity-80 transition-opacity"
                        >
                          <Instagram className="h-5 w-5 text-white" />
                        </a>
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                          <Instagram className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="https://instagram.com/p/..."
                        value={socialMediaLinks.instagram || ''}
                        onChange={(e) => handleSocialMediaLinkChange('instagram', e.target.value)}
                        className={`${
                          socialMediaLinks.instagram && !isValidUrl(socialMediaLinks.instagram)
                            ? 'border-destructive focus-visible:ring-destructive'
                            : ''
                        }`}
                      />
                      {socialMediaLinks.instagram && !isValidUrl(socialMediaLinks.instagram) && (
                        <p className="text-xs text-destructive mt-1">Please enter a valid URL</p>
                      )}
                    </div>
                    {socialMediaLinks.instagram && isValidUrl(socialMediaLinks.instagram) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Facebook */}
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 transition-opacity ${
                      socialMediaLinks.facebook && isValidUrl(socialMediaLinks.facebook) 
                        ? 'opacity-100' 
                        : 'opacity-30'
                    }`}>
                      {socialMediaLinks.facebook && isValidUrl(socialMediaLinks.facebook) ? (
                        <a 
                          href={socialMediaLinks.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1877F2] hover:opacity-80 transition-opacity"
                        >
                          <Facebook className="h-5 w-5 text-white" />
                        </a>
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                          <Facebook className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="https://facebook.com/..."
                        value={socialMediaLinks.facebook || ''}
                        onChange={(e) => handleSocialMediaLinkChange('facebook', e.target.value)}
                        className={`${
                          socialMediaLinks.facebook && !isValidUrl(socialMediaLinks.facebook)
                            ? 'border-destructive focus-visible:ring-destructive'
                            : ''
                        }`}
                      />
                      {socialMediaLinks.facebook && !isValidUrl(socialMediaLinks.facebook) && (
                        <p className="text-xs text-destructive mt-1">Please enter a valid URL</p>
                      )}
                    </div>
                    {socialMediaLinks.facebook && isValidUrl(socialMediaLinks.facebook) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* YouTube */}
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 transition-opacity ${
                      socialMediaLinks.youtube && isValidUrl(socialMediaLinks.youtube) 
                        ? 'opacity-100' 
                        : 'opacity-30'
                    }`}>
                      {socialMediaLinks.youtube && isValidUrl(socialMediaLinks.youtube) ? (
                        <a 
                          href={socialMediaLinks.youtube} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#FF0000] hover:opacity-80 transition-opacity"
                        >
                          <Youtube className="h-5 w-5 text-white" />
                        </a>
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                          <Youtube className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="https://youtube.com/shorts/..."
                        value={socialMediaLinks.youtube || ''}
                        onChange={(e) => handleSocialMediaLinkChange('youtube', e.target.value)}
                        className={`${
                          socialMediaLinks.youtube && !isValidUrl(socialMediaLinks.youtube)
                            ? 'border-destructive focus-visible:ring-destructive'
                            : ''
                        }`}
                      />
                      {socialMediaLinks.youtube && !isValidUrl(socialMediaLinks.youtube) && (
                        <p className="text-xs text-destructive mt-1">Please enter a valid URL</p>
                      )}
                    </div>
                    {socialMediaLinks.youtube && isValidUrl(socialMediaLinks.youtube) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={socialMediaLinks.youtube} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Twitter */}
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 transition-opacity ${
                      socialMediaLinks.twitter && isValidUrl(socialMediaLinks.twitter) 
                        ? 'opacity-100' 
                        : 'opacity-30'
                    }`}>
                      {socialMediaLinks.twitter && isValidUrl(socialMediaLinks.twitter) ? (
                        <a 
                          href={socialMediaLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1DA1F2] hover:opacity-80 transition-opacity"
                        >
                          <Twitter className="h-5 w-5 text-white" />
                        </a>
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                          <Twitter className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="https://twitter.com/..."
                        value={socialMediaLinks.twitter || ''}
                        onChange={(e) => handleSocialMediaLinkChange('twitter', e.target.value)}
                        className={`${
                          socialMediaLinks.twitter && !isValidUrl(socialMediaLinks.twitter)
                            ? 'border-destructive focus-visible:ring-destructive'
                            : ''
                        }`}
                      />
                      {socialMediaLinks.twitter && !isValidUrl(socialMediaLinks.twitter) && (
                        <p className="text-xs text-destructive mt-1">Please enter a valid URL</p>
                      )}
                    </div>
                    {socialMediaLinks.twitter && isValidUrl(socialMediaLinks.twitter) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              )}

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6">
                  {selectedOrder.status === 'pending_checkout' ? (
                    <div className="flex justify-end gap-3">
                      {isModifyMode ? (
                        <>
                          <Button variant="outline" onClick={handleCancelModification}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleSaveModification} disabled={updateOrderMutation.isPending}>
                            {updateOrderMutation.isPending ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Edit className="w-4 h-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="destructive" 
                            onClick={() => {
                              handleReject(selectedOrder);
                              setIsDetailOpen(false);
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleModify}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modify
                          </Button>
                          <Button 
                            onClick={() => {
                              handleCheckout(selectedOrder);
                              setIsDetailOpen(false);
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Checkout
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button onClick={() => handleUpdate(selectedOrder)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Order
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
