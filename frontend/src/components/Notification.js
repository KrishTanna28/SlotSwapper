import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import {BellIcon} from 'lucide-react';

const Notification = () => {
  const { notification, clearNotification } = useSocket();

  useEffect(() => {
    if (notification) {
      // Auto-clear notification after 5 seconds
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-black text-white border-black';
      case 'error':
        return 'bg-gray-100 border-black text-black';
      case 'info':
        return 'bg-white border-black text-black';
      default:
        return 'bg-gray-100 border-gray-300 text-black';
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-in">
      <div
        className={`min-w-[400px] max-w-lg p-6 rounded-lg border-4 shadow-2xl ${getNotificationStyles(
          notification.type
        )}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-lg font-bold mb-1">
              {notification.type === 'success' && '✓ Success'}
              {notification.type === 'error' && '✕ Rejected'}
              {notification.type === 'info' && <> <BellIcon className="text-4xl mb-4" /> New Request </>}
            </p>
            <p className="text-base">{notification.message}</p>
          </div>
          <button
            onClick={clearNotification}
            className="text-3xl font-bold hover:opacity-70 leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
