import { useEffect } from 'react';
import { FiUser, FiLoader } from 'react-icons/fi';
import { useUser } from '../../hooks/useUser';
import { useProfile } from '../../hooks/useProfile';
import ProfileInfo from './ProfileInfo';
import ProfileThreads from './ProfileThreads';

const ProfileBio = () => {
    const { user, loading: userLoading, getCurrentUser } = useUser();
    const { 
        threads,
        loading: threadLoading,
        activeFilter,
        setActiveFilter,
        fetchUserContent 
    } = useProfile();

    // Fetch the current user when the component mounts
    useEffect(() => {
        const fetchUser = async () => {
            await getCurrentUser();
        };
        fetchUser();
    }, []);

    // Fetch user content when the user changes or filter changes
    useEffect(() => {
        if (user) {
            fetchUserContent();
        }
    }, [user, activeFilter]);

    if (userLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center animate-pulse mb-4">
                    <FiUser className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400">Loading profile...</p>
            </div>
        );
    }

    return (
        <>
            {!userLoading && user && <ProfileInfo user={user} />}

            {threadLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center animate-pulse mb-4">
                        <FiLoader className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400">Loading content...</p>
                </div>
            ) : (
                <ProfileThreads 
                    threads={threads}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />
            )}
        </>
    );
};

export default ProfileBio;
