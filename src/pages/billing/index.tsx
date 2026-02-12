
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Download, Eye, Calendar, CreditCard, Smartphone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PaymentMethodForm } from '@/components/billing/PaymentMethodForm';
import { toast } from '@/components/ui/use-toast';

type PaymentMethod = {
  id: number;
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  last4: string;
};

export const BillingPage = () => {
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBilling, setSelectedBilling] = useState<typeof billingHistory[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [isRemoveCardOpen, setIsRemoveCardOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PaymentMethod | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isRemovingCard, setIsRemovingCard] = useState(false);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  React.useEffect(() => {
    fetchCards();
    fetchBillingHistory();
    fetchSubscriptionPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchCards = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/billing/cards', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const cards = data.cards.map((card: any) => ({
          id: card.id,
          cardNumber: '',
          cardholderName: card.cardholder_name,
          expirationDate: `${card.card_exp_month}/${card.card_exp_year}`,
          last4: card.card_last4
        }));
        setPaymentMethods(cards);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingHistory = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/billing/operations', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const history = data.operations.map((op: any) => ({
          id: op.id,
          date: op.created_at,
          plan: op.description || 'Subscription',
          amount: parseFloat(op.amount),
          paymentMethod: op.card_brand || 'Card',
          status: op.status === 'completed' ? 'Paid' : op.status === 'pending' ? 'Pending' : 'Refunded',
          invoiceId: op.id
        }));
        setBillingHistory(history);
      }
    } catch (error) {
      console.error('Error fetching billing history:', error);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/billing/plans');
      const data = await response.json();
      
      if (data.success) {
        setSubscriptionPlans(data.plans);
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/billing/subscription', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setCurrentSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching current subscription:', error);
    }
  };

  const handleSubscribe = async (planId: number) => {
    setIsSubscribing(true);
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/billing/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ plan_id: planId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchCurrentSubscription();
        await fetchBillingHistory();
        toast({
          title: "Subscription activated",
          description: "Your subscription has been activated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to subscribe",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe to plan",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  // Sample billing history data
  const sampleBillingHistory = [
    {
      id: 1,
      date: '2024-01-15',
      plan: 'Pro Plan',
      amount: 2999,
      paymentMethod: 'UPI',
      status: 'Paid',
      invoiceId: 'INV-2024-001'
    },
    {
      id: 2,
      date: '2023-12-15',
      plan: 'Pro Plan',
      amount: 2999,
      paymentMethod: 'Card',
      status: 'Paid',
      invoiceId: 'INV-2023-012'
    },
    {
      id: 3,
      date: '2023-11-15',
      plan: 'Basic Plan',
      amount: 999,
      paymentMethod: 'UPI',
      status: 'Paid',
      invoiceId: 'INV-2023-011'
    },
    {
      id: 4,
      date: '2023-10-15',
      plan: 'Basic Plan',
      amount: 999,
      paymentMethod: 'Card',
      status: 'Refunded',
      invoiceId: 'INV-2023-010'
    },
    {
      id: 5,
      date: '2023-09-15',
      plan: 'Pro Plan',
      amount: 2999,
      paymentMethod: 'UPI',
      status: 'Pending',
      invoiceId: 'INV-2023-009'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'Refunded':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="h-4 w-4 text-purple-600" />;
      case 'Card':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-purple-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAddCard = async (data: any) => {
    setIsAddingCard(true);
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/billing/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          card_token: 'tok_' + Math.random().toString(36).substr(2, 9),
          card_last4: data.cardNumber.slice(-4),
          card_brand: 'Visa',
          card_exp_month: data.expirationDate.split('/')[0],
          card_exp_year: data.expirationDate.split('/')[1],
          cardholder_name: data.cardholderName,
          is_default: true
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchCards();
        setIsAddCardOpen(false);
        toast({
          title: "Payment method added",
          description: "Your card has been added successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add card",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding card:', error);
      toast({
        title: "Error",
        description: "Failed to add card",
        variant: "destructive"
      });
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleEditCard = (data: any) => {
    if (!selectedCard) return;
    
    setPaymentMethods(paymentMethods.map(card => 
      card.id === selectedCard.id 
        ? { ...card, cardholderName: data.cardholderName, expirationDate: data.expirationDate }
        : card
    ));
    setIsEditCardOpen(false);
    setSelectedCard(null);
    toast({
      title: "Payment method updated",
      description: "Your card details have been updated successfully.",
    });
  };

  const handleRemoveCard = async () => {
    if (!selectedCard) return;
    
    setIsRemovingCard(true);
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:3001/api/billing/cards/${selectedCard.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchCards();
        setIsRemoveCardOpen(false);
        setSelectedCard(null);
        toast({
          title: "Payment method removed",
          description: "Your card has been removed successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to remove card",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error removing card:', error);
      toast({
        title: "Error",
        description: "Failed to remove card",
        variant: "destructive"
      });
    } finally {
      setIsRemovingCard(false);
    }
  };

  const totalAmount = billingHistory.reduce((sum, item) => sum + (item.amount || 0), 0);
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading billing information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6 text-foreground">Billing & Subscription</h1>
          
          {currentSubscription && (
            <Card className="mb-6 border-primary">
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="font-semibold">{currentSubscription.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Started On</p>
                    <p className="font-semibold">{formatDate(currentSubscription.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Billing Date</p>
                    <p className="font-semibold">{formatDate(currentSubscription.next_billing_date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={`border-2 ${plan.is_popular ? 'border-primary shadow-lg relative' : 'border-transparent hover:border-primary'} transition-all duration-300`}>
                {plan.is_popular && (
                  <div className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">Popular</div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2 text-3xl font-bold">${plan.price}<span className="text-sm text-muted-foreground font-normal">/{plan.billing_period}</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {parseFloat(plan.price) === 0 ? (
                    currentSubscription && parseFloat(currentSubscription.price) > 0 ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isSubscribing}
                      >
                        {isSubscribing ? 'Processing...' : 'Downgrade to Free'}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        Current Plan
                      </Button>
                    )
                  ) : (
                    <Button 
                      variant={plan.is_popular ? 'default' : 'outline'} 
                      className="w-full"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isSubscribing || currentSubscription?.plan_id === plan.id}
                    >
                      {currentSubscription?.plan_id === plan.id 
                        ? 'Current Plan' 
                        : isSubscribing 
                        ? 'Processing...' 
                        : !currentSubscription || parseFloat(plan.price) > parseFloat(currentSubscription.price)
                        ? 'Upgrade Plan'
                        : 'Downgrade Plan'
                      }
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No payment method added yet</p>
                    <Button onClick={() => setIsAddCardOpen(true)}>
                      Add Credit Card
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {paymentMethods.map((card) => (
                        <div key={card.id} className="flex items-center p-4 border rounded-lg">
                          <CreditCard className="h-6 w-6 mr-4" />
                          <div>
                            <p className="font-medium">•••• •••• •••• {card.last4}</p>
                            <p className="text-sm text-muted-foreground">Expires {card.expirationDate}</p>
                          </div>
                          <div className="ml-auto">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setSelectedCard(card);
                                setIsRemoveCardOpen(true);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setIsAddCardOpen(true)}
                    >
                      Add Another Card
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-semibold text-foreground">Billing History</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">View your recent invoices and payment history</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                        <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-muted border-b">
                    <div className="grid grid-cols-6 gap-4 px-6 py-4 text-sm font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        Date
                      </div>
                      <div>Plan</div>
                      <div>Amount</div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                        Payment Method
                      </div>
                      <div>Status</div>
                      <div className="text-center">Invoice</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-border">
                    {billingHistory.map((item) => (
                      <div key={item.id} className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-muted/50 transition-colors">
                        <div className="text-sm text-foreground font-medium">
                          {formatDate(item.date)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.plan}
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {formatCurrency(item.amount)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getPaymentMethodIcon(item.paymentMethod)}
                          {item.paymentMethod}
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3"
                            onClick={() => {
                              setSelectedBilling(item);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method
            </DialogDescription>
          </DialogHeader>
          <PaymentMethodForm
            onSubmit={handleAddCard}
            onCancel={() => setIsAddCardOpen(false)}
            isLoading={isAddingCard}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Payment Method Dialog */}
      <Dialog open={isEditCardOpen} onOpenChange={setIsEditCardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
            <DialogDescription>
              Update your card details
            </DialogDescription>
          </DialogHeader>
          {selectedCard && (
            <PaymentMethodForm
              isEdit
              defaultValues={{
                cardholderName: selectedCard.cardholderName,
                cardNumber: '•'.repeat(12) + selectedCard.last4,
                expirationDate: selectedCard.expirationDate,
              }}
              onSubmit={handleEditCard}
              onCancel={() => {
                setIsEditCardOpen(false);
                setSelectedCard(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Remove Card Confirmation Dialog */}
      <Dialog open={isRemoveCardOpen} onOpenChange={setIsRemoveCardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this card ending in {selectedCard?.last4}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRemoveCardOpen(false);
                setSelectedCard(null);
              }}
              disabled={isRemovingCard}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRemoveCard}
              disabled={isRemovingCard}
            >
              {isRemovingCard ? 'Removing...' : 'Remove Card'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Invoice Details</DialogTitle>
            <DialogDescription>
              Complete details for invoice {selectedBilling?.invoiceId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBilling && (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="text-lg font-semibold">{selectedBilling.invoiceId}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedBilling.status)}
                </div>
              </div>

              <Separator />

              {/* Billing Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Date</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    {formatDate(selectedBilling.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Payment Method</p>
                  <p className="flex items-center gap-2">
                    {getPaymentMethodIcon(selectedBilling.paymentMethod)}
                    {selectedBilling.paymentMethod}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Plan Details */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Plan Details</p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Plan</span>
                    <span className="font-medium">{selectedBilling.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Billing Period</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Amount Breakdown */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Amount Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedBilling.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (18% GST)</span>
                    <span>{formatCurrency(selectedBilling.amount * 0.18)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>{formatCurrency(selectedBilling.amount * 1.18)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" variant="default">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button className="flex-1" variant="outline">
                  Print Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingPage;
