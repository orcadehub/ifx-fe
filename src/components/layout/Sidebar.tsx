import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/components/theme-provider';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  ChartNoAxesColumnIncreasing, 
  FileSpreadsheet, 
  ShoppingCart,
  Inbox,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MdOutlineMiscellaneousServices } from 'react-icons/md';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const currentPath = location.pathname;
  const [userType, setUserType] = useState<string>(() => {
    return localStorage.getItem('userType') || 'business';
  });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebar:collapsed');
    if (savedCollapsedState) {
      setIsCollapsed(savedCollapsedState === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar:collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const getMenuItems = () => {
    if (userType === 'business') {
      return [
        { text: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/business' },
        { text: 'Influencers', icon: <Users size={18} />, path: '/influencers/simple' },
        { text: 'Chats', icon: <MessageSquare size={18} />, path: '/chats' },
        { text: 'Reach', icon: <ChartNoAxesColumnIncreasing size={18} />, path: '/reach' },
        { text: 'Services', icon: <MdOutlineMiscellaneousServices size={18} />, path: '/services' },
        { text: 'Reports', icon: <FileSpreadsheet size={18} />, path: '/reports' },
        { text: 'Orders', icon: <ShoppingCart size={18} />, path: '/orders' },
      ];
    } else if (userType === 'influencer') {
      return [
        { text: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/influencer' },
        { text: 'Chats', icon: <MessageSquare size={18} />, path: '/chats' },
        { text: 'Reach', icon: <ChartNoAxesColumnIncreasing size={18} />, path: '/reach' },
        { text: 'Services', icon: <Settings size={18} />, path: '/services' },
        { text: 'Orders', icon: <ShoppingCart size={18} />, path: '/orders' },
        { text: 'Requests', icon: <Inbox size={18} />, path: '/requests' },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const isActive = (path: string) => currentPath === path;

  return (
    <aside 
      className={cn(
        'flex flex-col border-r border-border transition-all duration-300 h-screen bg-background relative',
        isCollapsed ? 'w-20' : 'w-60'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <img src="/Favicon_Logo.png" alt="IK" className="w-8 h-8" />
            <h1 className="text-xl font-bold">
              <span className="text-primary">Influex</span>
              <span className="text-foreground">Konnect</span>
            </h1>
          </div>
        ) : (
          <img src="/Favicon_Logo.png" alt="IK" className="w-10 h-10" />
        )}
      </div>

      {/* Toggle Button on Border */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-6 z-50 w-8 h-8 rounded-full border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.text}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                isCollapsed && 'justify-center'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="text-lg font-medium">{item.text}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer - Theme Toggle */}
      <div className="border-t border-border p-3">
        {!isCollapsed ? (
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted hover:text-foreground transition-colors"
            >
              <Sun size={16} />
              <span className="text-sm">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted hover:text-foreground transition-colors"
            >
              <Moon size={16} />
              <span className="text-sm">Dark</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full p-2 rounded-lg border border-border hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
