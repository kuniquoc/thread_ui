import ThreadComponent from '../thread/Thread';
import { Thread } from '../../types';
import { FiEdit, FiMessageCircle, FiRepeat } from 'react-icons/fi';

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
            <div className="mt-6 space-y-4 px-4 max-w-full overflow-x-hidden">
                {threads.length > 0 ? (
                    threads.map(thread => (
                        <div key={thread.id} className="rounded-lg transition-colors duration-200 max-w-full">
                            <ThreadComponent {...thread} />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                            {activeFilter === 'my' && <FiEdit className="w-8 h-8 text-gray-400" />}
                            {activeFilter === 'replies' && <FiMessageCircle className="w-8 h-8 text-gray-400" />}
                            {activeFilter === 'reposts' && <FiRepeat className="w-8 h-8 text-gray-400" />}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No {activeFilter === 'my' ? 'threads' : activeFilter} yet</h3>
                        <p className="text-gray-400">
                            {activeFilter === 'my' && "When you post threads, they'll show up here"}
                            {activeFilter === 'replies' && "When you reply to threads, they'll show up here"}
                            {activeFilter === 'reposts' && "When you repost threads, they'll show up here"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileThreads;
