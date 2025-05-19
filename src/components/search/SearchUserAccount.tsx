import { FiUser, FiUserCheck } from 'react-icons/fi';

interface SearchUserAccountProps {
    user: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        avatar: string | null;
    };
    isFollowing: boolean;
    onFollow: () => void;
}

const SearchUserAccount = ({ user, isFollowing, onFollow }: SearchUserAccountProps) => {
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={`${user.username}'s avatar`}
                            className="w-12 h-12 rounded-full border-2 border-gray-700"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                            <span className="text-gray-400 font-medium">
                                {getInitials(user.first_name, user.last_name)}
                            </span>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="font-medium text-white">
                        {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                </div>
            </div>

            <button
                onClick={onFollow}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2
                    ${isFollowing
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                    }`}
            >
                {isFollowing ? (
                    <>
                        <FiUserCheck className="w-4 h-4" />
                        <span>Following</span>
                    </>
                ) : (
                    <>
                        <FiUser className="w-4 h-4" />
                        <span>Follow</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default SearchUserAccount;
