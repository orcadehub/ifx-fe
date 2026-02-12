
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  dashboardPath: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  toggleSidebar,
  dashboardPath
}) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={cn("p-4 flex justify-between items-center", isCollapsed && "justify-center")}>
      {!isCollapsed ? (
        <Link to={dashboardPath} className="text-primary font-bold text-2xl">
          <span className="text-primary">Influence</span>
          <span className={resolvedTheme === "dark" ? "text-gray-200" : "text-gray-800"}>Connect</span>
        </Link>
      ) : (
        <Link to={dashboardPath} className="flex items-center justify-center">
          <img src="/Favicon_Logo.png" alt="IC" className="w-8 h-8" />
        </Link>
      )}
      
      {!isCollapsed && (
        <button 
          onClick={toggleSidebar} 
          className="flex items-center justify-center w-6 h-6 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300" 
          aria-label="Collapse sidebar"
        >
          <ChevronLeft size={18} />
        </button>
      )}
    </div>
  );
};

export default SidebarHeader;
