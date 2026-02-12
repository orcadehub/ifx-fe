import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUp, ArrowDown, Clock, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, getTimeDifference } from "@/lib/wallet-utils";
import { toast } from "@/components/ui/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import ConditionalHeader from "@/components/layout/ConditionalHeader";
import { getWallet, getWalletTransactions, createWalletOrder, verifyWalletPayment } from '@/lib/wallet-api';

const BusinessWalletPage = () => {
  const [addAmount, setAddAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: getWallet,
    refetchOnWindowFocus: false
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => getWalletTransactions('all'),
    refetchOnWindowFocus: false
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyWalletPayment,
    onSuccess: () => {
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
      toast({
        title: "Success",
        description: "Funds added to wallet successfully.",
      });
      setAddAmount("");
    },
    onError: (error: any) => {
      setIsProcessing(false);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to add funds",
        variant: "destructive",
      });
    }
  });

  const balance = wallet?.balance || 0;
  const isLoading = walletLoading || transactionsLoading;

  const totalSpent = transactions
    .filter(t => t.transaction_type === 'payment' || t.transaction_type === 'debit')
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

  const totalDeposited = transactions
    .filter(t => t.transaction_type === 'deposit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const handleAddFunds = async () => {
    if (!addAmount || isNaN(Number(addAmount)) || Number(addAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = await createWalletOrder(Number(addAmount));
      
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "InfluexKonnect",
        description: "Add funds to wallet",
        handler: async (response: any) => {
          verifyPaymentMutation.mutate({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: orderData.amount
          });
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        },
        theme: {
          color: "#3399cc"
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'deposit' || type === 'refund') {
      return <ArrowUp className="w-5 h-5 text-green-500" />;
    } else if (type === 'payment' || type === 'debit') {
      return <ArrowDown className="w-5 h-5 text-red-500" />;
    }
    return <Clock className="w-5 h-5 text-gray-500" />;
  };

  const getTransactionColor = (type: string) => {
    if (type === 'deposit' || type === 'refund') return 'text-green-600';
    if (type === 'payment' || type === 'debit') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTransactionSign = (type: string) => {
    return (type === 'deposit' || type === 'refund') ? '+' : '-';
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ConditionalHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Wallet</h1>
            </div>

            {/* Wallet Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground">Current Balance</h3>
                <p className="text-3xl font-bold mt-1">{formatCurrency(balance)}</p>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="w-full"
                    />
                    <Button 
                      onClick={handleAddFunds}
                      disabled={isProcessing}
                      className="whitespace-nowrap"
                    >
                      {isProcessing ? 'Processing...' : 'Add Funds'}
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
                <p className="text-3xl font-bold mt-1">{formatCurrency(totalSpent)}</p>
                <p className="text-sm text-muted-foreground mt-4">
                  From order payments and services
                </p>
              </Card>

              <Card className="p-6 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground">Total Deposited</h3>
                <p className="text-3xl font-bold mt-1">{formatCurrency(totalDeposited)}</p>
                <p className="text-sm text-muted-foreground mt-4">
                  Total funds added to wallet
                </p>
              </Card>
            </div>

            {/* Transactions */}
            <div className="bg-card shadow-sm rounded-lg">
              <Tabs defaultValue="all">
                <div className="border-b px-6 py-4 flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="all">All Transactions</TabsTrigger>
                    <TabsTrigger value="deposits">Deposits</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="refunds">Refunds</TabsTrigger>
                  </TabsList>
                  <div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>

                <TabsContent value="all" className="p-0">
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No transactions found.
                      </div>
                    ) : (
                      transactions.map((transaction) => (
                        <div key={transaction.id} className="p-4 hover:bg-accent">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                                {getTransactionIcon(transaction.transaction_type)}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {getTimeDifference(transaction.created_at)} • {formatDate(transaction.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                                {getTransactionSign(transaction.transaction_type)}
                                {formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(transaction.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="deposits" className="p-0">
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : transactions.filter(t => t.transaction_type === 'deposit').length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No deposits found.
                      </div>
                    ) : (
                      transactions
                        .filter(t => t.transaction_type === 'deposit')
                        .map((transaction) => (
                          <div key={transaction.id} className="p-4 hover:bg-accent">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                                  <ArrowUp className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {getTimeDifference(transaction.created_at)} • {formatDate(transaction.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">
                                  +{formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(transaction.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="payments" className="p-0">
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : transactions.filter(t => t.transaction_type === 'payment' || t.transaction_type === 'debit').length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No payments found.
                      </div>
                    ) : (
                      transactions
                        .filter(t => t.transaction_type === 'payment' || t.transaction_type === 'debit')
                        .map((transaction) => (
                          <div key={transaction.id} className="p-4 hover:bg-accent">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                                  <ArrowDown className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {getTimeDifference(transaction.created_at)} • {formatDate(transaction.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-red-600">
                                  -{formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(transaction.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="refunds" className="p-0">
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : transactions.filter(t => t.transaction_type === 'refund').length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No refunds found.
                      </div>
                    ) : (
                      transactions
                        .filter(t => t.transaction_type === 'refund')
                        .map((transaction) => (
                          <div key={transaction.id} className="p-4 hover:bg-accent">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                                  <ArrowUp className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {getTimeDifference(transaction.created_at)} • {formatDate(transaction.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">
                                  +{formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(transaction.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessWalletPage;
