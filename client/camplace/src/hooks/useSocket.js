import { useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { user } = useAuth();
  
  const socket = useMemo(() => {
    if (!user) return null;
    return io();
  }, [user?.id, user?._id, user]);

  useEffect(() => {
    if (socket && user) {
      socket.emit('join', user.id || user._id);

      if (user.role === 'admin') {
        socket.emit('join', 'admin');
      }

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, user]);

  return socket;
};
