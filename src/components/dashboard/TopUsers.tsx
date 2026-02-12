
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserWithOrders {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
  ordersCount: number;
}

interface TopUsersProps {
  users: UserWithOrders[];
  title: string;
  isLoading?: boolean;
  userType: 'influencer' | 'business';
}

const TopUsers: React.FC<TopUsersProps> = ({ users, title, isLoading = false, userType }) => {
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleUserClick = (userId: string) => {
    // Navigate to existing account pages instead of dynamic profile routes
    if (userType === 'influencer') {
      navigate('/account/influencer');
    } else if (userType === 'business') {
      navigate('/account/business');
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center mb-3">
          {userType === 'influencer' ? (
            <User className="mr-2 h-5 w-5 text-primary" />
          ) : (
            <Users className="mr-2 h-5 w-5 text-primary" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-muted/60 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted/60 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted/60 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-4">
            {users.map(user => (
              <div 
                key={user.id} 
                className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground hover:text-primary">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {user.ordersCount} {user.ordersCount === 1 ? 'order' : 'orders'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            {userType === 'influencer' ? (
              <User className="h-10 w-10 text-muted-foreground mb-2" />
            ) : (
              <Users className="h-10 w-10 text-muted-foreground mb-2" />
            )}
            <h3 className="text-sm font-medium text-foreground">No {userType === 'influencer' ? 'influencers' : 'businesses'} yet</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Connect with {userType === 'influencer' ? 'influencers' : 'businesses'} to see them here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopUsers;
