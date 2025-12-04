import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

type NetworkContextType = {
  online: 'yes' | 'no' | null; // null = not decided yet
  lastState: NetInfoState | null;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return ctx;
};

export const NetworkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [online, setOnline] = useState<'yes' | 'no' | null>(null);
  const [lastState, setLastState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    const sub = NetInfo.addEventListener(state => {
      setLastState(state);

      // “Online” means we have a connection and it is not explicitly unreachable
      const isOnline = state.isConnected && state.isInternetReachable !== false;
      console.log('[NetworkContext]', state);
      if (isOnline === true) {
        console.log('[NetworkContext] esta online');
        setOnline('yes');
      } else if (isOnline === false) {
        console.log('[NetworkContext] esta offline');
        setOnline('no');
      }
    });

    return () => sub();
  }, []);

  return (
    <NetworkContext.Provider value={{ online, lastState }}>
      {children}
    </NetworkContext.Provider>
  );
};
