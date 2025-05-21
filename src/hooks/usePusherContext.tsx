import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Pusher, { Channel } from 'pusher-js';

const PUSHER_APP_KEY = '09581ace43aa27b85e17';
const PUSHER_CLUSTER = 'ap1';

interface PusherContextType {
    pusherClient: Pusher | null;
    isConnected: boolean;
    subscribe: (channelName: string) => Channel | null;
    unsubscribe: (channelName: string) => void;
}

const PusherContext = createContext<PusherContextType | null>(null);

export const PusherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pusherClient, setPusherClient] = useState<Pusher | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Khởi tạo Pusher client
        const client = new Pusher(PUSHER_APP_KEY, {
            cluster: PUSHER_CLUSTER,
            forceTLS: true,
        });

        // Bind các sự kiện kết nối
        client.connection.bind('connected', () => {
            console.log('✅ Pusher connected');
            setIsConnected(true);
        });

        client.connection.bind('disconnected', () => {
            console.log('🔌 Pusher disconnected');
            setIsConnected(false);
        });

        client.connection.bind('error', (err: any) => {
            console.error('❌ Pusher error:', err);
            setIsConnected(false);
        });

        setPusherClient(client);

        // Cleanup khi unmount
        return () => {
            client.disconnect();
        };
    }, []);

    const subscribe = useCallback((channelName: string): Channel | null => {
        if (!pusherClient || !channelName) return null;
        
        try {
            console.log(`📥 Subscribing to channel: ${channelName}`);
            return pusherClient.subscribe(channelName);
        } catch (error) {
            console.error(`❌ Error subscribing to ${channelName}:`, error);
            return null;
        }
    }, [pusherClient]);

    const unsubscribe = useCallback((channelName: string) => {
        if (!pusherClient || !channelName) return;
        
        try {
            console.log(`📤 Unsubscribing from channel: ${channelName}`);
            pusherClient.unsubscribe(channelName);
        } catch (error) {
            console.error(`❌ Error unsubscribing from ${channelName}:`, error);
        }
    }, [pusherClient]);

    return (
        <PusherContext.Provider value={{ pusherClient, isConnected, subscribe, unsubscribe }}>
            {children}
        </PusherContext.Provider>
    );
};

export const usePusherContext = () => {
    const context = useContext(PusherContext);
    if (!context) {
        throw new Error('usePusherContext must be used within a PusherProvider');
    }
    return context;
};