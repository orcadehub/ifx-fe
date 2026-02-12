
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
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
import CreateTicketDialog from "@/components/support/CreateTicketDialog";
import { Ticket, TicketStatus, TicketPriority, UserType, TicketCategory } from "@/types/ticket";
import { toast } from "@/hooks/use-toast";
import { FileSpreadsheet, Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const teamMembers = [
  { id: "team1", name: "John Smith" },
  { id: "team2", name: "Sarah Johnson" },
  { id: "team3", name: "Mike Thompson" },
];

const mockUsers = [
  { id: "user1", name: "John Doe", type: "business" as UserType },
  { id: "user2", name: "Jane Smith", type: "influencer" as UserType },
  { id: "user3", name: "Robert Brown", type: "business" as UserType },
  { id: "user4", name: "Emily Clark", type: "influencer" as UserType },
];

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  
  useEffect(() => {
    fetchTickets();
  }, []);
  
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/tickets/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
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
        setTickets(formattedTickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({
        title: "Error",
        description: "Failed to load support tickets",
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
          description: isInternal ? "Internal note added successfully" : "Reply sent successfully",
        });
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };
  
  const handleStatusChange = async (ticketId: string, status: TicketStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTickets();
        toast({
          title: "Status updated",
          description: `Ticket status changed to ${status}`,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };
  
  const handleAssigneeChange = (ticketId: string, assigneeId: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            assignedTo: assigneeId !== "unassigned" ? assigneeId : undefined,
            lastUpdated: new Date().toISOString(),
          };
        }
        return ticket;
      })
    );
    
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => {
        if (prev) {
          return {
            ...prev,
            assignedTo: assigneeId !== "unassigned" ? assigneeId : undefined,
            lastUpdated: new Date().toISOString(),
          };
        }
        return prev;
      });
    }
    
    const assigneeName = assigneeId !== "unassigned"
      ? teamMembers.find((m) => m.id === assigneeId)?.name || "Unknown"
      : "Unassigned";
    
    toast({
      title: "Assignee updated",
      description: `Ticket assigned to ${assigneeName}`,
    });
  };
  
  const handlePriorityChange = async (ticketId: string, priority: TicketPriority) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/tickets/${ticketId}/priority`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priority })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTickets();
        toast({
          title: "Priority updated",
          description: `Ticket priority changed to ${priority}`,
        });
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      });
    }
  };
  
  const handleCreateTicket = async (
    userId: string,
    userName: string,
    userType: UserType,
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
          description: "Support ticket has been created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const exportToCSV = () => {
    // Create CSV content from tickets
    const headers = [
      "Ticket ID",
      "Created At",
      "User Name",
      "User Type",
      "Subject",
      "Status",
      "Priority",
      "Assigned To",
      "Last Updated",
    ];
    
    const rows = tickets.map((ticket) => [
      ticket.id,
      new Date(ticket.createdAt).toLocaleString(),
      ticket.userName,
      ticket.userType,
      ticket.subject,
      ticket.status,
      ticket.priority,
      ticket.assignedTo !== undefined
        ? teamMembers.find((m) => m.id === ticket.assignedTo)?.name || "Unknown"
        : "Unassigned",
      new Date(ticket.lastUpdated).toLocaleString(),
    ]);
    
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `support_tickets_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: "Support tickets exported to CSV",
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">🛠️ Support Center</h1>
            <p className="text-muted-foreground">
              Manage and respond to support tickets from users
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreateTicketOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
            <Button variant="outline" onClick={exportToCSV}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Support Tickets</CardTitle>
                <CardDescription>
                  View and manage all support tickets across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading tickets...</p>
                ) : (
                  <TicketTable
                    tickets={tickets}
                    isAdmin={true}
                    onViewTicket={handleViewTicket}
                    teamMembers={teamMembers}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    onPriorityChange={handlePriorityChange}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>New Tickets</CardTitle>
                <CardDescription>
                  Recently submitted tickets that require attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading tickets...</p>
                ) : (
                  <TicketTable
                    tickets={tickets.filter((t) => t.status === "New")}
                    isAdmin={true}
                    onViewTicket={handleViewTicket}
                    teamMembers={teamMembers}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    onPriorityChange={handlePriorityChange}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inProgress">
            <Card>
              <CardHeader>
                <CardTitle>In Progress Tickets</CardTitle>
                <CardDescription>
                  Tickets currently being addressed by the team
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading tickets...</p>
                ) : (
                  <TicketTable
                    tickets={tickets.filter((t) => t.status === "In Progress")}
                    isAdmin={true}
                    onViewTicket={handleViewTicket}
                    teamMembers={teamMembers}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    onPriorityChange={handlePriorityChange}
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
                  Tickets that have been successfully resolved
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
                    isAdmin={true}
                    onViewTicket={handleViewTicket}
                    teamMembers={teamMembers}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    onPriorityChange={handlePriorityChange}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <TicketDetail
          ticket={selectedTicket}
          isAdmin={true}
          onClose={() => setSelectedTicket(null)}
          onReply={handleReply}
          onStatusChange={handleStatusChange}
          onAssigneeChange={handleAssigneeChange}
          teamMembers={teamMembers}
        />
        
        <CreateTicketDialog
          open={isCreateTicketOpen}
          onOpenChange={setIsCreateTicketOpen}
          onSubmit={handleCreateTicket}
          users={mockUsers}
        />
      </div>
    </Layout>
  );
};

export default AdminSupportPage;
