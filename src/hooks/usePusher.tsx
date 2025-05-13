import Pusher from 'pusher-js';
import { useEffect } from 'react';

const PUSHER_APP_KEY = '09581ace43aa27b85e17'; // Replace with your Pusher app key
const PUSHER_CLUSTER = 'ap1'; // Replace with your Pusher cluster

export const usePusher = (channelName: string, onEvent: (data: any) => void) => {
    useEffect(() => {
        const pusher = new Pusher(PUSHER_APP_KEY, {
            cluster: PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe(channelName);
        channel.bind('comment_update', (data: any) => {
            try {
                // First parse the outer data if it's a string
                const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                
                // Then parse the inner data field if it exists and is a string
                const finalData = parsedData.data ? 
                    (typeof parsedData.data === 'string' ? JSON.parse(parsedData.data) : parsedData.data) 
                    : parsedData;
                
                onEvent(finalData);
            } catch (error) {
                console.error('Error parsing Pusher event data:', error);
                // Still try to pass the original data if parsing fails
                onEvent(data);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [channelName, onEvent]);
};