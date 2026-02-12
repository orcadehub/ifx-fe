
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TicketTable from "@/components/support/TicketTable";
import TicketDetail from "@/components/support/TicketDetail";
import CreateTicketForm from "@/components/support/CreateTicketForm";
import { Ticket, TicketCategory, TicketPriority, UserType } from "@/types/ticket";
import { toast } from "@/hooks/use-toast";
import { Headset } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const SupportPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType>("business");
  
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType") as UserType | null;
    if (storedUserType && (storedUserType === "business" || storedUserType === "influencer")) {
      setUserType(storedUserType);
    }
    
    fetchTickets();
  }, []);
  
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/tickets/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('Tickets API response:', data);
      if (data.success) {
        const formattedTickets = data.tickets.map((t: any) => ({
          id: t.id,
          userId: t.user_id.toString(),
          userName: t.user_name,
          userType: t.user_type,
          subject: t.subject,
          category: t.category,
          priority: t.priority,
          status: t.status,
          createdAt: t.created_at,
          lastUpdated: t.updated_at,
          messages: [{
            id: `m${t.id}`,
            ticketId: t.id,
            userId: t.user_id.toString(),
            userName: t.user_name,
            userType: t.user_type,
            message: t.message,
            createdAt: t.created_at,
            isInternal: false,
            attachments: t.attachments
          }]
        }));
        console.log('Formatted tickets:', formattedTickets);
        setTickets(formattedTickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({
        title: "Error",
        description: "Failed to load your support tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewTicket = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
    }
  };
  
  const handleReply = async (
    ticketId: string,
    message: string,
    isInternal: boolean,
    attachments: File[]
  ) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/tickets/${ticketId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message, attachments: attachments.length ? attachments.map(f => ({ name: f.name, type: f.type })) : null })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTickets();
        toast({
          title: "Reply sent",
          description: "Your reply has been sent successfully",
        });
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: "Failed to send your reply",
        variant: "destructive",
      });
    }
  };
  
  const handleCreateTicket = async (
    subject: string,
    category: TicketCategory,
    priority: TicketPriority,
    message: string,
    attachments: File[]
  ) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/tickets/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject,
          category,
          priority,
          message,
          attachments: attachments.length ? attachments.map(f => ({ name: f.name, type: f.type })) : null
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTickets();
        toast({
          title: "Ticket created",
          description: "Your support ticket has been created successfully",
        });
      } else {
        throw new Error(data.message || 'Failed to create ticket');
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create your support ticket",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center"><Headset className="w-8 h-8 mr-3" /> Support Center</h1>
          <p className="text-muted-foreground">
            Get help and support for your account and services
          </p>
        </div>
        
        <Tabs defaultValue="new">
          <TabsList className="mb-6">
            <TabsTrigger value="new">Create New Ticket</TabsTrigger>
            <TabsTrigger value="active">Active Tickets</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Tickets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new">
            <CreateTicketForm onSubmit={handleCreateTicket} />
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Support Tickets</CardTitle>
                <CardDescription>
                  View and manage your ongoing support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading tickets...</p>
                ) : tickets.filter((t) => t.status === "New" || t.status === "In Progress").length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No active tickets</p>
                ) : (
                  <TicketTable
                    tickets={tickets.filter(
                      (t) => t.status === "New" || t.status === "In Progress"
                    )}
                    isAdmin={false}
                    onViewTicket={handleViewTicket}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resolved">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Tickets</CardTitle>
                <CardDescription>
                  View your past and resolved support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading tickets...</p>
                ) : (
                  <TicketTable
                    tickets={tickets.filter(
                      (t) => t.status === "Resolved" || t.status === "Closed"
                    )}
                    isAdmin={false}
                    onViewTicket={handleViewTicket}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <TicketDetail
          ticket={selectedTicket}
          isAdmin={false}
          onClose={() => setSelectedTicket(null)}
          onReply={handleReply}
        />
      </div>
    </Layout>
  );
};

export default SupportPage;
