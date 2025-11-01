import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to Socket.IO server
      const socketInstance = io(process.env.REACT_APP_API_URL, {
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
        // Join room with user ID
        socketInstance.emit('join', user._id || user.id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      // Listen for swap notifications
      socketInstance.on('swapAccepted', (data) => {
        console.log('Swap accepted notification:', data);
        setNotification({
          type: 'success',
          message: `Your swap request was accepted! ${data.message}`,
          data,
        });
      });

      socketInstance.on('swapRejected', (data) => {
        console.log('Swap rejected notification:', data);
        setNotification({
          type: 'error',
          message: `Your swap request was rejected. ${data.message}`,
          data,
        });
      });

      socketInstance.on('newSwapRequest', (data) => {
        console.log('New swap request notification:', data);
        setNotification({
          type: 'info',
          message: `You have a new swap request!`,
          data,
        });
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user]);

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <SocketContext.Provider value={{ socket, notification, clearNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
