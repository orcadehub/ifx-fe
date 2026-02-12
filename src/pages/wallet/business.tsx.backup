import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Clock, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, getStatusColor, getTimeDifference } from "@/lib/wallet-utils";
import { toast } from "@/components/ui/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import ConditionalHeader from "@/components/layout/ConditionalHeader";
import { supabase } from "@/integrations/supabase/client";

type Transaction = {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
  balance_after: number;
  metadata: any;
};

const BusinessWalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addAmount, setAddAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);

  // Add dummy data for demonstration
  const dummyTransactions: Transaction[] = [
    {
      id: '1',
      amount: 5000,
      transaction_type: 'deposit',
      description: 'Added funds to wallet',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      balance_after: 5000,
      metadata: {}
    },
    {
      id: '2',
      amount: 1500,
      transaction_type: 'order_payment',
      description: 'Payment for Instagram promotion by @influencer_john',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      balance_after: 3500,
      metadata: {}
    },
    {
      id: '3',
      amount: 500,
      transaction_type: 'refund',
      description: 'Refund for cancelled order #ORD-2024-001',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      balance_after: 4000,
      metadata: {}
    },
    {
      id: '4',
      amount: 2000,
      transaction_type: 'deposit',
      description: 'Added funds via UPI',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      balance_after: 6000,
      metadata: {}
    },
    {
      id: '5',
      amount: 800,
      transaction_type: 'order_payment',
      description: 'Payment for YouTube video promotion',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      balance_after: 5200,
      metadata: {}
    },
    {
      id: '6',
      amount: 300,
      transaction_type: 'adjustment',
      description: 'Referral bonus from @sarah_marketing',
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      balance_after: 5500,
      metadata: { type: 'referral_bonus' }
    },
    {
      id: '7',
      amount: 250,
      transaction_type: 'adjustment',
      description: 'Sign-up bonus',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      balance_after: 5750,
      metadata: { type: 'signup_bonus' }
    }
  ];

  useEffect(() => {
    // Use dummy data for demonstration
    setTransactions(dummyTransactions);
    setBalance(3500);
    setTotalSpent(2300);
    setTotalWithdrawn(0);
    setIsLoading(false);
    // fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch wallet data
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (walletError) throw walletError;

        setBalance(walletData?.current_balance || 0);
        setTotalWithdrawn(walletData?.total_withdrawn || 0);

        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (transactionsError) throw transactionsError;

        setTransactions(transactionsData || []);

        // Calculate total spent
        const spent = transactionsData
          ?.filter(t => t.transaction_type === 'order_payment')
          .reduce((sum, t) => sum + t.amount, 0) || 0;
          
        setTotalSpent(spent);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wallet data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!addAmount || isNaN(Number(addAmount)) || Number(addAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to add to your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingFunds(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // In a real implementation, this would call a Supabase Edge Function
        // that handles the payment gateway integration and then updates the wallet
        
        // For demo purposes, directly add funds
        const { data, error } = await supabase.functions.invoke('add-funds', {
          body: { amount: Number(addAmount) }
        });

        if (error) throw error;

        toast({
          title: "Funds Added",
          description: `₹${addAmount} has been added to your wallet successfully.`,
        });

        setAddAmount("");
        fetchWalletData();
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      toast({
        title: "Transaction Failed",
        description: "Failed to add funds to your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingFunds(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'order_earning':
      case 'refund':
        return <ArrowUp className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
      case 'order_payment':
        return <ArrowDown className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'order_earning':
      case 'refund':
        return 'text-green-600';
      case 'withdrawal':
      case 'order_payment':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
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
                      disabled={isAddingFunds}
                      className="whitespace-nowrap"
                    >
                      Add Funds
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
                <h3 className="text-sm font-medium text-muted-foreground">Total Withdrawn</h3>
                <p className="text-3xl font-bold mt-1">{formatCurrency(totalWithdrawn)}</p>
                <p className="text-sm text-muted-foreground mt-4">
                  Including refunds and adjustments
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
                    <TabsTrigger value="bonus">Bonus</TabsTrigger>
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
                                {transaction.transaction_type === 'deposit' || 
                                  transaction.transaction_type === 'refund' || 
                                  transaction.transaction_type === 'order_earning' 
                                  ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Balance: {formatCurrency(transaction.balance_after)}
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
                                  +{formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Balance: {formatCurrency(transaction.balance_after)}
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
                    ) : transactions.filter(t => t.transaction_type === 'order_payment').length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No payments found.
                      </div>
                    ) : (
                      transactions
                        .filter(t => t.transaction_type === 'order_payment')
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
                                  -{formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Balance: {formatCurrency(transaction.balance_after)}
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
                                  +{formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Balance: {formatCurrency(transaction.balance_after)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="bonus" className="p-0">
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : transactions.filter(t => t.transaction_type === 'adjustment').length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No bonus transactions found.
                      </div>
                    ) : (
                      transactions
                        .filter(t => t.transaction_type === 'adjustment')
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
                                  +{formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Balance: {formatCurrency(transaction.balance_after)}
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
