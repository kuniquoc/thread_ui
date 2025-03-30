'use client';

import PageWrapper from '../components/PageWrapper';
import NotificationList from '../components/notification/NotificationList';

const activity = () => {
    return (
        <PageWrapper>
            <div className="pt-5 pb-16 flex flex-col items-center overflow-y-auto">
                {/* Header section */}
                <header className="mb-3 w-full scroll-mb-2">
                    <div className="px-4">
                        <h1 className="text-4xl font-semibold mb-3">
                            Notifications
                        </h1>
                    </div>
                </header>

                {/* Notifications List */}
                <NotificationList />
            </div>
        </PageWrapper>
    );
};

export default activity;
