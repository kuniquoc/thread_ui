import { useEffect, useRef } from 'react';
import { Channel } from 'pusher-js';
import { usePusherContext } from './usePusherContext';

interface PusherEvent {
    type: string;
    [key: string]: any;
}

export const usePusher = (channelName: string, onEvent: (data: PusherEvent) => void) => {
    const { subscribe, unsubscribe } = usePusherContext();
    const channelRef = useRef<Channel | null>(null);

    useEffect(() => {
        if (!channelName) {
            console.log('⚠️ No channel name provided');
            return;
        }

        // Cleanup previous subscription if exists
        if (channelRef.current) {
            channelRef.current.unbind_all();
            unsubscribe(channelRef.current.name);
            channelRef.current = null;
        }

        // Subscribe to new channel
        const channel = subscribe(channelName);
        if (channel) {
            channelRef.current = channel;
            
            // Bind to all events
            channel.bind_global((_eventName: string, data: any) => {
                if (data && typeof data === 'object' && 'type' in data) {
                    onEvent(data as PusherEvent);
                }
            });
        }

        // Cleanup on unmount or when channelName changes
        return () => {
            if (channelRef.current) {
                channelRef.current.unbind_all();
                unsubscribe(channelRef.current.name);
                channelRef.current = null;
            }
        };
    }, [channelName, subscribe, unsubscribe, onEvent]);
};