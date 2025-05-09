import Pusher from 'pusher-js';
import { useEffect } from 'react';

const PUSHER_APP_KEY = 'your-pusher-key'; // Replace with your Pusher app key
const PUSHER_CLUSTER = 'ap1'; // Replace with your Pusher cluster

export const usePusher = (channelName: string, onEvent: (data: any) => void) => {
    useEffect(() => {
        const pusher = new Pusher(PUSHER_APP_KEY, {
            cluster: PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe(channelName);
        channel.bind('comment_update', (data: any) => {
            try {
                const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                onEvent(parsedData);
            } catch (error) {
                console.error('Error parsing Pusher event data:', error);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [channelName, onEvent]);
};