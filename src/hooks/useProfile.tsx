import { useState } from 'react';
import { Thread } from '../types/ThreadTypes';
import { useThread } from './useThread';

export const useProfile = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('my');

    const { getUserThreads, getCommentedThreads, getRepostedThreads } = useThread();

    const fetchUserContent = async () => {
        setLoading(true);
        try {
            let response;
            switch (activeFilter) {
                case 'replies':
                    response = await getCommentedThreads();
                    break;
                case 'reposts':
                    response = await getRepostedThreads();
                    break;
                default:
                    response = await getUserThreads();
            }
            if (response) {
                setThreads(response.results);
            }
        } catch (error) {
            console.error('Failed to fetch user content:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        threads,
        loading,
        activeFilter,
        setActiveFilter,
        fetchUserContent
    };
};
