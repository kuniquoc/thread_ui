import ThreadComponent from '../thread/Thread';
import { Thread } from '../../types';

interface ProfileThreadsProps {
    threads: Thread[];
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}

const ProfileThreads = ({ threads, activeFilter, setActiveFilter }: ProfileThreadsProps) => {
    const tabs = [
        { id: 'my', title: 'My Threads' },
        { id: 'replies', title: 'Replies' },
        { id: 'reposts', title: 'Reposts' }
    ];

    return (
        <div className="border-t border-[#333] mt-4">
            <div className="border-b border-[#333]">
                <div className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`px-4 py-2 font-medium text-sm ${
                                activeFilter === tab.id
                                    ? 'text-white border-b-2 border-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-4">
                {threads.map(thread => (
                    <ThreadComponent
                        key={thread.id}
                        {...thread}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProfileThreads;
