'use client';

import PageWrapper from '../components/PageWrapper';
import ProfileBio from '../components/profile/ProfileBio';

const profile = () => {
    return (
        <PageWrapper>
            <div className="pt-5 pb-16 flex flex-col items-center overscroll-y-auto">
                {/* Profile Bio */}
                <header className="px-4 w-200">
                    <ProfileBio />
                </header>
            </div>
        </PageWrapper>
    );
};

export default profile;
