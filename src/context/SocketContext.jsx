import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [monitoredLocations, setMonitoredLocations] = useState({});

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socketInstance = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    // Join personal user room
    socket.emit('join_user_room', user._id);

    // If role is guardian, join monitoring room
    if (user.role === 'guardian') {
      socket.emit('monitor_user', { guardianId: user._id, wardId: null });
    }

    // Listen for incoming Emergency SOS alert
    const handleSOSAlert = (alertData) => {
      console.log('🚨 Incoming SOS Emergency Alert received:', alertData);
      setActiveAlerts((prev) => [alertData, ...prev.filter((a) => a.emergencyId !== alertData.emergencyId)]);

      // Audio notification if browser permits
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High alarm pitch
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } catch (e) {
        // Audio auto-play might be restricted
      }
    };

    // Listen for live location updates from monitored wards
    const handleLocationUpdate = (locData) => {
      if (locData && locData.userId) {
        setMonitoredLocations((prev) => ({
          ...prev,
          [locData.userId]: locData,
        }));
      }
    };

    socket.on('emergency_sos_alert', handleSOSAlert);
    socket.on('guardian_location_update', handleLocationUpdate);

    return () => {
      socket.off('emergency_sos_alert', handleSOSAlert);
      socket.off('guardian_location_update', handleLocationUpdate);
    };
  }, [socket, user]);

  const dismissAlert = (emergencyId) => {
    setActiveAlerts((prev) => prev.filter((a) => a.emergencyId !== emergencyId));
  };

  const broadcastLiveLocation = (lat, lng, accuracy, address) => {
    if (socket && user) {
      socket.emit('live_location_ping', {
        userId: user._id,
        latitude: lat,
        longitude: lng,
        accuracy,
        address,
        user: {
          _id: user._id,
          name: user.name,
          safetyStatus: user.safetyStatus,
        },
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        activeAlerts,
        monitoredLocations,
        dismissAlert,
        broadcastLiveLocation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
