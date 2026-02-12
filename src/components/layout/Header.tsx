
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Wallet, Heart } from 'lucide-react';
import SearchBar from './header/SearchBar';
import NotificationBell from './header/NotificationBell';
import UserProfileMenu from './header/UserProfileMenu';
import { useHeaderData } from '@/hooks/useHeaderData';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const Header = () => {
  const { userData, notificationCount } = useHeaderData();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  const navigateToWallet = () => {
    navigate(`/wallet/${userType}`);
  };

  const navigateToOffers = () => {
    navigate('/offers');
  };

  const navigateToWishlist = () => {
    navigate('/wishlist');
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between bg-background w-full">
      {/* Left side - Search Bar */}
      <div className="pl-6">
        {userType !== 'business' && userType !== 'admin' && userType !== 'influencer' && <SearchBar />}
      </div>
      
      {/* Right side - All utility icons */}
      <div className="flex items-center gap-3 pr-6">
        {(userType === 'business' || userType === 'influencer') && (
          <>
            <button 
              className="relative cursor-pointer hover:opacity-80 transition-opacity p-2 rounded-lg hover:bg-accent"
              onClick={navigateToOffers}
              title="Offers"
            >
              <Gift className="w-5 h-5 text-primary" />
            </button>
            <button 
              className="relative cursor-pointer hover:opacity-80 transition-opacity p-2 rounded-lg hover:bg-accent"
              onClick={navigateToWishlist}
              title="Wishlist"
            >
              <Heart className="w-5 h-5 text-primary" />
            </button>
            <button 
              className="relative cursor-pointer hover:opacity-80 transition-opacity p-2 rounded-lg hover:bg-accent"
              onClick={navigateToWallet}
              title="Wallet"
            >
              <Wallet className="w-5 h-5 text-primary" />
            </button>
          </>
        )}
        <NotificationBell count={notificationCount} />
        <UserProfileMenu userData={userData} />
      </div>
    </header>
  );
};

export default Header;
