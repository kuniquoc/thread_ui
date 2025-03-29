'use client';

import PageWrapper from '../components/PageWrapper';
import UserActivity from '../components/activity/UserActivity';
import RonaldoAvatar from '/avatars/ronaldo-avatar.jpg';
import ZuckAvatar from '/avatars/zuck-avatar.jpg';
import Avatar4 from '/avatars/avatar-4.jpg';
import Avatar2 from '/avatars/avatar-2.jpg';
import Avatar3 from '/avatars/avatar-3.jpg';
import SahilAvatar from '/avatars/sahil-bloom-avatar.jpg';
import NikeLogo from '/logo/nike-logo.jpg';
import GeekAvatar from '/avatars/avatar-1.jpeg';

const activity = () => {
    return (
        <PageWrapper>
            <div className="pt-5 pb-16 flex flex-col items-center overflow-y-auto">
                {/* Header section */}
                <header className="mb-3 w-full scroll-mb-2">
                    <div className="px-4">
                        <h1 className="text-4xl font-semibold mb-3">
                            Activity
                        </h1>
                    </div>
                    <div className="flex justify-start px-4 gap-2 overflow-x-auto hide-scrollbar scroll-smooth scroll-m-2 scroll-p-4">
                        <button className="border border-white bg-white text-black text-xs px-8 py-1.5 rounded-lg">
                            All
                        </button>
                        <button className="border border-[#333] bg-transparent text-gray-200 text-xs px-8 py-1.5 rounded-lg">
                            Replies
                        </button>
                        <button className="border border-[#333] bg-transparent text-gray-200 text-xs px-8 py-1.5 rounded-lg">
                            Metions
                        </button>
                        <button className="border border-[#333] bg-transparent text-gray-200 text-xs px-8 py-1.5 rounded-lg">
                            Verified
                        </button>
                    </div>
                </header>

                {/* Dynamic User Activity */}
                <UserActivity
                    avatar={RonaldoAvatar}
                    activityType="like"
                    username="cristiano"
                    isVerified={true}
                    activityTime="13m"
                    activityContent="When you're the only developer in a busi..."
                />

                <div className="border border-[#222] border-opacity-70 w-full"></div>

                <UserActivity
                    avatar={ZuckAvatar}
                    activityType="reply"
                    username="zuck"
                    isVerified={true}
                    activityTime="2h"
                    activityContent="Threads is the exact copy past of Twitter ..."
                    userReply="Exactly, that's why you can not edit posts here as well. Maybe we will only allow verified/paid accounts to edit posts, the way Twitter is doing it LOL"
                />

                <div className="border border-[#222] border-opacity-70 w-full"></div>

                <UserActivity
                    avatar={Avatar4}
                    activityType="like"
                    username="ahmadkhan"
                    isVerified={false}
                    activityTime="4h"
                    activityContent="Focus"
                />

                <div className="border border-[#222] border-opacity-70 w-full"></div>

                <UserActivity
                    avatar={Avatar2}
                    activityType="follow"
                    username="taylorswift"
                    isVerified={true}
                    activityTime="18h"
                    activityContent="Followed you"
                />

                <div className="border border-[#222] border-opacity-70 w-full"></div>

                <UserActivity
                    avatar={Avatar3}
                    activityType="follow"
                    username="yahabibi"
                    isVerified={true}
                    activityTime="1d"
                    activityContent="Followed you"
                />

                <div className="border border-[#222] border-opacity-70 w-full"></div>

                <UserActivity
                    avatar={GeekAvatar}
                    activityType="reply"
                    username="yrashidkhan01"
                    isVerified={false}
                    activityTime="2d"
                    activityContent="but it's smoother than Twitter tbh"
                    userReply="I never thought that Ctrl + C & Ctrl + V is also a programming, until the Threads was launched."
                />

                <div className="border border-[#222] border-opacity-70 w-full"></div>

                <UserActivity
                    avatar={NikeLogo}
                    activityType="like"
                    username="nike"
                    isVerified={true}
                    activityTime="3d"
                    activityContent="Focusing on the things that are within..."
                />

                <div className="border border-[#222] border-opacity-70 w-full"></div>

                <UserActivity
                    avatar={SahilAvatar}
                    activityType="like"
                    username="sahilbloom"
                    isVerified={true}
                    activityTime="3d"
                    activityContent="Focusing on the things that are within..."
                />

                <div className="border border-[#222] border-opacity-70 w-full"></div>
            </div>
        </PageWrapper>
    );
};

export default activity;
