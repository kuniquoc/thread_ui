import { useEffect } from 'react';
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

    return (
        <>
            {userLoading && <div>Loading user...</div>}
            {!userLoading && user && <ProfileInfo user={user} />}

            {threadLoading && <div>Loading threads...</div>}
            {!threadLoading && (
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
