import PageWrapper from '../components/PageWrapper';
import UserAccount from '../components/search/UserAccount';
import YusufAvatar from '/avatars/hamza-yusuf-avatar.png';
import RonaldoAvatar from '/avatars/ronaldo-avatar.jpg';
import RashidAvatar from '/avatars/rashid-khan-avatar.jpg';
import AppleLogo from '/logo/apple-logo.jpg';
import SmashingMagLogo from '/logo/smashing-magazine-logo.jpg';
import AlokozayLogo from '/logo/alokozay-logo.jpg';
import RealMadridLogo from '/logo/real-madrid-logo.jpg';
import GoogleLogo from '/logo/google-logo.jpg';
import NikeLogo from '/logo/nike-logo.jpg';
import ZuckAvatar from '/avatars/zuck-avatar.jpg';
import SalahAvatar from '/avatars/mohammed-salah-avatar.jpg';

const search = () => {
    return (
        <PageWrapper>
            <div className="pt-5 pb-16 flex flex-col items-center overflow-y-auto hide-scrollbar">
                {/* Header section */}
                <header className="w-full px-4">
                    <h1 className="text-4xl font-semibold mb-2">Search</h1>
                    <div>
                        <form action="#">
                            <label htmlFor="search">
                                <input
                                    type="search"
                                    id="search"
                                    placeholder="Search"
                                    className="w-full border-none rounded-lg text-md px-3 py-2 bg-[#333] text-gray-200"
                                />
                            </label>
                        </form>
                    </div>
                </header>

                {/* Dynamic Search Account */}
                <UserAccount
                    avatar={YusufAvatar}
                    username="hamzayusuf"
                    fullName="Hamza Yusuf"
                    isVerified={true}
                    followedBy={RonaldoAvatar}
                    followedByAnother={RashidAvatar}
                    followersCount="2m"
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>

                {/* Dynamic Search Account */}
                <UserAccount
                    avatar={AppleLogo}
                    username="apple"
                    fullName="Apple Inc"
                    isVerified={true}
                    followedBy={RashidAvatar}
                    followersCount="780k"
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>

                <UserAccount
                    avatar={AlokozayLogo}
                    username="alokozay"
                    fullName="Alokozay Group"
                    isVerified={true}
                    followersCount="10m"
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>

                <UserAccount
                    avatar={RonaldoAvatar}
                    username="cristiano"
                    fullName="Cristiano Ronaldo"
                    isVerified={true}
                    followersCount="90m"
                    followedBy={RashidAvatar}
                    followedByAnother={SalahAvatar}
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>

                <UserAccount
                    avatar={SmashingMagLogo}
                    username="smashingmag"
                    fullName="Smashing Magazine"
                    isVerified={true}
                    followersCount="190k"
                    followedBy={AppleLogo}
                    followedByAnother={GoogleLogo}
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>

                <UserAccount
                    avatar={RashidAvatar}
                    username="rashidkhan"
                    fullName="Rashid Khan"
                    isVerified={true}
                    followersCount="190k"
                    followedBy={NikeLogo}
                    followedByAnother={RonaldoAvatar}
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>

                <UserAccount
                    avatar={NikeLogo}
                    username="nike"
                    fullName="Nike"
                    isVerified={true}
                    followersCount="700k"
                    followedBy={RealMadridLogo}
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>

                <UserAccount
                    avatar={GoogleLogo}
                    username="Google"
                    fullName="Google Inc"
                    isVerified={true}
                    followersCount="1.2m"
                    followedBy={AppleLogo}
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>

                <UserAccount
                    avatar={ZuckAvatar}
                    username="zuck"
                    fullName="Mark Zuckerberg"
                    isVerified={true}
                    followersCount="5m"
                    followedBy={SmashingMagLogo}
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>

                <UserAccount
                    avatar={RealMadridLogo}
                    username="realmadrid"
                    fullName="Real Madrid"
                    isVerified={true}
                    followersCount="50m"
                    followedBy={RonaldoAvatar}
                    followedByAnother={NikeLogo}
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>

                <UserAccount
                    avatar={SalahAvatar}
                    username="mosalah"
                    fullName="Mohamed Salah"
                    isVerified={true}
                    followersCount="5m"
                    followedBy={RonaldoAvatar}
                    followedByAnother={NikeLogo}
                />

                <div className="border border-[#222] border-opacity-50 w-full"></div>
            </div>
        </PageWrapper>
    );
};

export default search;
