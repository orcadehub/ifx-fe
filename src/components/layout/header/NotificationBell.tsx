
import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationBellProps {
  count: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count }) => {
  return (
    <Link to="/notifications" className="relative cursor-pointer hover:opacity-80 transition-opacity p-2 rounded-lg hover:bg-accent">
      <Bell className="w-5 h-5 text-primary" />
      {count > 0 && (
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
