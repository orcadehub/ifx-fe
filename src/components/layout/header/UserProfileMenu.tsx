
import React from 'react';
import { ChevronDown, Settings, User, FileSpreadsheet, LogOut, BadgeIndianRupee, HelpCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfileMenuProps {
  userData: {
    fullName: string;
    email: string;
    avatarUrl: string;
  };
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ userData }) => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType') || 'business';
  let userId = localStorage.getItem('userId');
  
  // Fallback: get userId from userData if not directly available
  if (!userId) {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      userId = parsedData.id;
    }
  }
  
  console.log('UserProfileMenu userId:', userId);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
      navigate('/landing');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:bg-accent p-1 rounded-lg transition-all duration-300">
          <Avatar>
            {userData.avatarUrl ? (
              <AvatarImage 
                src={userData.avatarUrl} 
                alt={`${userData.fullName}'s avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary text-white">
                {userData.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="text-left hidden md:block">
            <div className="text-sm font-medium text-foreground">{userData.fullName}</div>
            <div className="text-xs text-muted-foreground">{userData.email}</div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 animate-fade-in" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={() => navigate(`/profile/${userId}`)}>
          <User className="h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <Link to="/account/settings" className="w-full">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          <Link to="/billing" className="w-full">Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <BadgeIndianRupee className="h-4 w-4" />
          <Link to={`/wallet/${userType === 'admin' ? 'business' : userType}`} className="w-full">Payments</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <Link to="/support" className="w-full">Support</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
