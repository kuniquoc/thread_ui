import { Tabs, TabItem } from 'flowbite-react';
import ThreadComponent from '../thread/Thread';
import { Thread } from '../../types';

interface ProfileThreadsProps {
    threads: Thread[];
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}

const ProfileThreads = ({ threads, activeFilter, setActiveFilter }: ProfileThreadsProps) => {
    return (
        <div className="border-t border-[#333] mt-4">
            <Tabs 
                className="border-b border-[#333]"
                onActiveTabChange={(tabIndex) => {
                    const filters = ['my', 'replies', 'reposts'];
                    setActiveFilter(filters[tabIndex]);
                }}
            >
                <TabItem 
                    active={activeFilter === 'my'} 
                    onClick={() => setActiveFilter('my')} 
                    title="Threads"
                >  
                    {threads.map(thread => (
                        <ThreadComponent
                            key={thread.id}
                            {...thread}
                        />
                    ))}
                </TabItem>
                <TabItem 
                    active={activeFilter === 'replies'} 
                    onClick={() => setActiveFilter('replies')} 
                    title="Replies"
                >
                    {threads.map(thread => (
                        <ThreadComponent
                            key={thread.id}
                            {...thread}
                        />
                    ))}
                </TabItem>
                <TabItem 
                    active={activeFilter === 'reposts'} 
                    onClick={() => setActiveFilter('reposts')} 
                    title="Reposts"
                >
                    {threads.map(thread => (
                        <ThreadComponent
                            key={thread.id}
                            {...thread}
                        />
                    ))}
                </TabItem>
            </Tabs>
        </div>
    );
};

export default ProfileThreads;
