
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { 
  BadgeIndianRupee, 
  Bell, 
  Calendar, 
  Check, 
  Clock, 
  MessageSquare, 
  Star, 
  ThumbsUp, 
  X 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/notifications-api';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'message' | 'payment' | 'request' | 'system' | 'schedule';
}

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchOnWindowFocus: false
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <BadgeIndianRupee className="h-5 w-5 text-green-500" />;
      case 'request':
        return <ThumbsUp className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-500" />;
      case 'schedule':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const unreadNotifications = notifications.filter(notification => !notification.read);
  const allNotifications = notifications;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <Button variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>

            <Tabs defaultValue="unread" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="unread">
                  Unread <span className="ml-2 bg-primary text-white rounded-full px-2 py-0.5 text-xs">{unreadNotifications.length}</span>
                </TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              
              <TabsContent value="unread" className="mt-0">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : unreadNotifications.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium text-foreground">No unread notifications</h3>
                    <p className="mt-1 text-muted-foreground">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unreadNotifications.map(notification => (
                      <div key={notification.id} className="bg-card p-4 rounded-lg border-l-4 border-primary shadow-sm">
                        <div className="flex justify-between">
                          <div className="flex space-x-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground">{notification.description}</p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : allNotifications.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium text-foreground">No notifications</h3>
                    <p className="mt-1 text-muted-foreground">You don't have any notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allNotifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "bg-card p-4 rounded-lg shadow-sm",
                          notification.read ? "border border-border" : "border-l-4 border-primary"
                        )}
                      >
                        <div className="flex justify-between">
                          <div className="flex space-x-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div>
                              <h3 className={cn("font-medium", notification.read ? "text-muted-foreground" : "text-foreground")}>{notification.title}</h3>
                              <p className="text-sm text-muted-foreground">{notification.description}</p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;
