import React from 'react';
import { Bell, X, Check, Info, AlertTriangle } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Language } from '@/types';

interface NotificationCenterProps {
  language: Language;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ language }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { notifications, markAsRead, clearNotification, clearAll } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const translations = {
    en: {
      notifications: "Notifications",
      clearAll: "Clear All",
      noNotifications: "No notifications",
      markAsRead: "Mark as read",
      remove: "Remove",
      justNow: "Just now",
      minutesAgo: "minutes ago",
      hoursAgo: "hours ago",
      daysAgo: "days ago"
    },
    ku: {
      notifications: "ئاگادارکردنەوەکان",
      clearAll: "سڕینەوەی هەموو",
      noNotifications: "هیچ ئاگادارکردنەوەیەک نییە",
      markAsRead: "نیشانکردن وەک خوێندراوە",
      remove: "سڕینەوە",
      justNow: "ئێستا",
      minutesAgo: "خولەک لەمەوبەر",
      hoursAgo: "کاتژمێر لەمەوبەر",
      daysAgo: "ڕۆژ لەمەوبەر"
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return translations[language].justNow;
    if (minutes < 60) return `${minutes} ${translations[language].minutesAgo}`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} ${translations[language].hoursAgo}`;
    return `${Math.floor(minutes / 1440)} ${translations[language].daysAgo}`;
  };

  const getIcon = (type: 'info' | 'success' | 'error') => {
    switch (type) {
      case 'success':
        return <Check className="text-green-500" size={20} />;
      case 'error':
        return <AlertTriangle className="text-red-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white hover:text-black transition-colors relative"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border-4 border-black shadow-lg z-50">
          <div className="flex justify-between items-center p-4 border-b-2 border-black">
            <h3 className="font-mono text-lg">{translations[language].notifications}</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm hover:text-gray-600"
              >
                {translations[language].clearAll}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center font-mono">
                {translations[language].noNotifications}
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-black ${
                    notification.read ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="font-mono font-bold">{notification.title}</h4>
                      <p className="font-mono text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm hover:text-gray-600"
                          title={translations[language].markAsRead}
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => clearNotification(notification.id)}
                        className="text-sm hover:text-gray-600"
                        title={translations[language].remove}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;