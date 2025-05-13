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
        <div className="border-t border-[#333] mt-6">
            <div className="border-b border-[#333] bg-[#111]">
                <div className="flex justify-between px-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`flex-1 px-6 py-3 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                                activeFilter === tab.id
                                    ? 'text-white border-b-2 border-blue-500 bg-[#222]'
                                    : 'text-gray-400 hover:text-white hover:bg-[#222]'
                            }`}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-6 space-y-4 px-4">
                {threads.map(thread => (
                    <div key={thread.id} className="hover:bg-[#111] rounded-lg transition-colors duration-200">
                        <ThreadComponent {...thread} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileThreads;
