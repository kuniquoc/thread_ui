import { useEffect, useRef } from 'react';
import { Channel } from 'pusher-js';
import { usePusherContext } from './usePusherContext';

export const usePusher = (channelName: string, onEvent: (data: any) => void) => {
    const { subscribe, unsubscribe } = usePusherContext();
    const channelRef = useRef<Channel | null>(null);

    useEffect(() => {
        if (!channelName) return;

        try {
            // Subscribe to channel
            const channel = subscribe(channelName);
            channelRef.current = channel;

            // Bind event handlers
            channel.bind('pusher:subscription_succeeded', () => {
                console.log(`Successfully subscribed to channel: ${channelName}`);
            });

            channel.bind('pusher:subscription_error', (error: any) => {
                console.error('Pusher subscription error:', error);
            });

            channel.bind('comment_update', (data: any) => {
                try {
                    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                    const finalData = parsedData.data ? 
                        (typeof parsedData.data === 'string' ? JSON.parse(parsedData.data) : parsedData.data) 
                        : parsedData;
                    
                    onEvent(finalData);
                } catch (error) {
                    console.error('Error parsing Pusher event data:', error);
                    onEvent(data);
                }
            });
        } catch (error) {
            console.error('Error subscribing to Pusher channel:', error);
        }

        // Cleanup
        return () => {
            if (channelRef.current) {
                channelRef.current.unbind_all();
                unsubscribe(channelName);
                channelRef.current = null;
            }
        };
    }, [channelName, onEvent, subscribe, unsubscribe]);
};