'use client';

import PageWrapper from '../components/PageWrapper';
import ProfileBio from '../components/profile/ProfileBio';

const Profile = () => {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <h1 className="text-2xl font-bold p-4 bg-[#111111] w-full text-center sticky top-0 z-10">Profile</h1>
            <PageWrapper>
                <div className="pt-5 pb-16 flex flex-col items-center">
                    <header className="px-4 w-200">
                        <ProfileBio />
                    </header>
                </div>
            </PageWrapper>
        </div>
    );
};

export default Profile;
