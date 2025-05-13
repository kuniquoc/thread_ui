import PageWrapper from '../components/PageWrapper';
import NotificationList from '../components/notification/NotificationList';

const Notification = () => {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <h1 className="text-2xl font-bold p-4 bg-[#111111] w-full text-center sticky top-0 z-10">Notifications</h1>
            <PageWrapper>
                <div className="pt-5 pb-16">
                    <NotificationList />
                </div>
            </PageWrapper>
        </div>
    );
};

export default Notification;
