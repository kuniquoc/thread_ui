import { FiUser, FiUserCheck, FiUserX } from 'react-icons/fi';
import { User } from '../../types';
import { useNavigate } from 'react-router-dom';

interface SearchUserAccountProps {
    user: User;
    isFollowing: boolean;
    onFollow: () => void;
}

const SearchUserAccount = ({ user, isFollowing, onFollow }: SearchUserAccountProps) => {
    const navigate = useNavigate();
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const handleUserClick = () => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser && currentUser.id === user.id) {
            navigate('/profile');
        } else {
            navigate(`/user/${user.id}`);
        }
    };

    return (
        <div className="flex items-center justify-between gap-4">
            <div 
                className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                onClick={handleUserClick}
            >
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
                onClick={(e) => {
                    e.stopPropagation();
                    onFollow();
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2
                    ${isFollowing
                        ? 'bg-gray-700/50 text-white hover:bg-red-600/80 hover:text-white group'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                    }`}
            >
                {isFollowing ? (
                    <>
                        <FiUserCheck className="w-4 h-4 group-hover:hidden" />
                        <FiUserX className="w-4 h-4 hidden group-hover:block" />
                        <span className="group-hover:hidden">Following</span>
                        <span className="hidden group-hover:block">Unfollow</span>
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
