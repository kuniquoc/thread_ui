import { UserResponse } from '../../types/AuthTypes';

interface SearchUserAccountProps {
    user: UserResponse;
    followersCount?: number;
}

const SearchUserAccount = ({
    user,   
}: SearchUserAccountProps) => {
    const { username, first_name, last_name, avatar } = user;
    const fullName = `${first_name} ${last_name}`.trim();

    return (
        <div className="px-4 w-full my-4 clear-both">
            <div className="flex justify-start items-start gap-4">
                <div className="">
                    <img
                        src={avatar || '/avatars/default-avatar.png'}  // Use default avatar as fallback
                        width={70}
                        height={70}
                        alt="Account Avatar"
                        className="rounded-full"
                    />
                </div>
                <div className="w-full">
                    <div className="if-verified flex items-center gap-2">
                        <p className="text-sm text-gray-100 leading-none">
                            {username}
                        </p>
                    </div>
                    <p className="text-sm text-[#777] mt-0.5">{fullName}</p>
                </div>
                <div className="text-gray-300 flex justify-end text-xs">
                    <button className="border border-[#333] px-6 py-1.5 rounded-lg">
                        Follow
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchUserAccount;
