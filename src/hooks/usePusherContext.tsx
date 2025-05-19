import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher, { Channel } from 'pusher-js';

const PUSHER_APP_KEY = '09581ace43aa27b85e17';
const PUSHER_CLUSTER = 'ap1';

interface PusherContextType {
    pusher: Pusher | null;
    subscribe: (channelName: string) => Channel;
    unsubscribe: (channelName: string) => void;
}

const PusherContext = createContext<PusherContextType | null>(null);

export const PusherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pusherClient, setPusherClient] = useState<Pusher | null>(null);

    useEffect(() => {
        const client = new Pusher(PUSHER_APP_KEY, {
            cluster: PUSHER_CLUSTER,
            forceTLS: true,
            enabledTransports: ['ws', 'wss'],
            activityTimeout: 120000,
            pongTimeout: 30000,
            wsHost: 'ws-ap1.pusher.com',
            disableStats: true
        });

        client.connection.bind('error', (err: any) => {
            console.error('Pusher connection error:', err);
        });

        client.connection.bind('state_change', (states: {
            previous: string;
            current: string;
        }) => {
            console.log(`Pusher state changed from ${states.previous} to ${states.current}`);
        });

        setPusherClient(client);

        return () => {
            client.disconnect();
        };
    }, []);

    const subscribe = (channelName: string) => {
        if (!pusherClient) {
            throw new Error('Pusher not initialized');
        }
        return pusherClient.subscribe(channelName);
    };

    const unsubscribe = (channelName: string) => {
        if (!pusherClient) {
            throw new Error('Pusher not initialized');
        }
        pusherClient.unsubscribe(channelName);
    };

    return (
        <PusherContext.Provider value={{ pusher: pusherClient, subscribe, unsubscribe }}>
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