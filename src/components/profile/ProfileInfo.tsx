"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FiCheck, FiCoffee, FiUsers, FiEdit, FiLock, FiUpload, FiX, FiChevronRight } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import type { User, Follow, UserFollower } from "../../types"
import { useUser } from "../../hooks/useUser"
import { useImageUpload } from "../../hooks/useImageUpload"
import { useFollow } from "../../hooks/useFollow"
import Modal from "../common/Modal"

interface ProfileInfoProps {
  user: User
}

// Button Component with Tailwind
const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  className?: string
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all whitespace-nowrap"
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-5 py-2.5 text-base"
  }
  const variantClasses = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60",
    secondary: "bg-slate-800 text-white hover:bg-slate-700",
    outline: "border border-slate-700 text-white hover:bg-white/5",
    ghost: "text-slate-400 hover:bg-white/5 hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? "cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  )
}

// Input Component with Tailwind
const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  className = "",
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-slate-400 mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 text-sm text-white bg-slate-800 border border-slate-700 rounded-md transition-all focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 ${className}`}
      />
    </div>
  )
}

// Avatar Component with Tailwind
const Avatar = ({
  src,
  alt,
  size = "medium",
  fallback,
}: {
  src?: string
  alt: string
  size?: "small" | "medium" | "large"
  fallback?: string
}) => {
  const [error, setError] = useState(!src)
  const sizeClasses = {
    small: "w-10 h-10 text-sm",
    medium: "w-16 h-16 text-base",
    large: "w-20 h-20 text-lg"
  }

  return (
    <div className={`rounded-full overflow-hidden flex items-center justify-center bg-slate-800 border-2 border-slate-700 ${sizeClasses[size]}`}>
      {!error && src ? (
        <img src={src} alt={alt} onError={() => setError(true)} className="w-full h-full object-cover" />
      ) : (
        <div className="font-semibold text-white">{fallback}</div>
      )}
    </div>
  )
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState<string | undefined>()
  const { updateProfile, changePassword, loading, getCurrentUser } = useUser()
  const { uploadImage, loading: uploadLoading } = useImageUpload()
  const { getFollowersCount, getFollowingList, getUserFollowsCount, getUserFollowers, followUser } = useFollow()
  const [followers, setFollowers] = useState<UserFollower[]>([])
  const [following, setFollowing] = useState<Follow[]>([])
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [followersLoading, setFollowersLoading] = useState(false)
  const [followingLoading, setFollowingLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar,
  })

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  })

  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
    setPasswordError(null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = await uploadImage(file)
      if (imageUrl) {
        setFormData({
          ...formData,
          avatar: imageUrl,
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await updateProfile(formData)
    if (result?.status === "success") {
      await getCurrentUser(true) // Force refresh user data
      setOpenModal(undefined)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.new_password2) {
      setPasswordError("New passwords don't match")
      return
    }
    const result = await changePassword(passwordData)
    if (result?.status === "success") {
      await getCurrentUser(true) // Force refresh user data
      setOpenModal(undefined)
      setPasswordData({
        old_password: "",
        new_password: "",
        new_password2: "",
      })
    }
  }

  const fetchFollowCounts = async () => {
    const followersResult = await getFollowersCount();
    if (followersResult) {
      setFollowersCount(followersResult.count);
    }

    if (user?.id) {
      const followingResult = await getUserFollowsCount(user.id);
      if (followingResult) {
        setFollowingCount(followingResult.following_count);
      }
    }
  }

  const fetchFollowers = async () => {
    setFollowersLoading(true);
    if (user?.id) {
      const result = await getUserFollowers(user.id);
      if (result) {
        setFollowers(result.results);
      }
    }
    setFollowersLoading(false);
  }

  const fetchFollowing = async () => {
    setFollowingLoading(true);
    if (user?.id) {
      const result = await getFollowingList(user.id);
      if (result) {
        setFollowing(result.results);
      }
    }
    setFollowingLoading(false);
  }

  const handleFollowAction = async (userId: number, isFollowed: boolean, type: 'follower' | 'following') => {
    const result = await followUser({ followed_id: userId });
    if (result) {
      if (type === 'follower') {
        // Update followers list
        setFollowers(prev => 
          prev.map(follower => 
            follower.id === userId 
              ? { ...follower, is_followed: !isFollowed }
              : follower
          )
        );
        // Update following count if following a follower
        if (!isFollowed) {
          setFollowingCount(prev => prev + 1);
        } else {
          setFollowingCount(prev => prev - 1);
        }
      } else {
        if (!isFollowed) {
          // Follow action - no need to do anything as they're already in following list
          return;
        }
        // Unfollow action
        setFollowing(prev => prev.filter(f => f.followed.id !== userId));
        setFollowingCount(prev => prev - 1);
      }
    }
  }

  const handleUserClick = async (userId: number) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser && currentUser.id === userId) {
      navigate('/profile');
    } else {
      navigate(`/user/${userId}`);
    }
  }

  useEffect(() => {
    fetchFollowCounts()
  }, [user])

  const handleFollowersClick = () => {
    setOpenModal("followers")
    fetchFollowers()
  }

  const handleFollowingClick = () => {
    setOpenModal("following");
    fetchFollowing();
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl border border-slate-700 p-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">
        <div className="flex items-center gap-4">
          <Avatar
            src={formData.avatar}
            alt={`${user.username}'s avatar`}
            size="large"
            fallback={getInitials(user.first_name, user.last_name)}
          />

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white m-0">{`${user.first_name} ${user.last_name}`}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/10 text-slate-400 text-xs px-2 py-1 rounded-full">@{user.username}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" size="small" onClick={() => setOpenModal("edit")} className="flex-1 md:flex-none">
            <FiEdit className="w-4 h-4" />
            Edit Profile
          </Button>
          <Button variant="outline" size="small" onClick={() => setOpenModal("password")} className="flex-1 md:flex-none">
            <FiLock className="w-4 h-4" />
            Change Password
          </Button>
        </div>
      </div>

      <div className="h-px bg-slate-700 my-6" />

      {/* Stats */}
      <div className="flex items-center gap-6 mt-4">
        <Button variant="ghost" onClick={handleFollowersClick}>
          <FiUsers className="w-4 h-4" />
          <span className="font-semibold">{followersCount}</span>
          <span>Followers</span>
        </Button>
        <Button variant="ghost" onClick={handleFollowingClick}>
          <FiUsers className="w-4 h-4" />
          <span className="font-semibold">{followingCount}</span>
          <span>Following</span>
        </Button>
      </div>

      {/* Feature Coming Soon Modal */}
      <Modal show={openModal === "pop-up"} onClose={() => setOpenModal(undefined)} className="max-w-sm">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl border border-slate-700">
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-emerald-600/10 rounded-full flex items-center justify-center mb-4">
              <FiCoffee className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Feature coming soon</h3>
            <p className="text-slate-400 mb-6">We're working hard to bring you this feature. Stay tuned!</p>
            <Button onClick={() => setOpenModal(undefined)}>
              <FiCheck className="w-4 h-4 text-emerald-600" />
              Ok, cool
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal show={openModal === "edit"} onClose={() => setOpenModal(undefined)}>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl border border-slate-700">
          <div className="flex justify-between items-center p-5 border-b border-slate-700">
            <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
            <button 
              className="text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all"
              onClick={() => setOpenModal(undefined)}
            >
              <FiX />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <Input label="Email" name="email" type="email" required value={formData.email} onChange={handleChange} />
            <Input
              label="First Name"
              name="first_name"
              type="text"
              required
              value={formData.first_name}
              onChange={handleChange}
            />
            <Input
              label="Last Name"
              name="last_name"
              type="text"
              required
              value={formData.last_name}
              onChange={handleChange}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Avatar</label>
              <div className="flex items-center gap-4 mt-1.5">
                {formData.avatar && (
                  <Avatar
                    src={formData.avatar}
                    alt="Preview"
                    size="medium"
                    fallback={getInitials(formData.first_name, formData.last_name)}
                  />
                )}
                <div className="flex-1">
                  <label 
                    htmlFor="avatar-upload" 
                    className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-700 rounded-md text-slate-400 text-sm cursor-pointer hover:bg-white/5 hover:text-white transition-all"
                  >
                    <FiUpload className="w-4 h-4" />
                    <span>Upload new image</span>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setOpenModal(undefined)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadLoading}>
                {loading || uploadLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={openModal === "password"} onClose={() => setOpenModal(undefined)}>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl border border-slate-700">
          <div className="flex justify-between items-center p-5 border-b border-slate-700">
            <h3 className="text-xl font-semibold text-white">Change Password</h3>
            <button 
              className="text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all"
              onClick={() => setOpenModal(undefined)}
            >
              <FiX />
            </button>
          </div>
          <form onSubmit={handlePasswordSubmit} className="p-6">
            <Input
              label="Current Password"
              name="old_password"
              type="password"
              required
              value={passwordData.old_password}
              onChange={handlePasswordChange}
            />
            <Input
              label="New Password"
              name="new_password"
              type="password"
              required
              value={passwordData.new_password}
              onChange={handlePasswordChange}
            />
            <Input
              label="Confirm New Password"
              name="new_password2"
              type="password"
              required
              value={passwordData.new_password2}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-600/10 rounded-md text-red-600 text-sm">
                <FiX className="w-4 h-4 flex-shrink-0" />
                {passwordError}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpenModal(undefined)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Followers Modal */}
      <Modal show={openModal === "followers"} onClose={() => {
        setOpenModal(undefined);
        fetchFollowCounts(); // Update counts when modal closes
      }}>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl border border-slate-700">
          <div className="flex justify-between items-center p-5 border-b border-slate-700">
            <h3 className="text-xl font-semibold text-white">Followers</h3>
            <button 
              className="text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all"
              onClick={() => setOpenModal(undefined)}
            >
              <FiX />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {followersLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
              </div>
            ) : followers.length > 0 ? (
              <div className="flex flex-col">
                {followers.map((follower) => (
                  <div 
                    key={follower.id} 
                    className="flex items-center gap-3 px-6 py-3 hover:bg-white/5 cursor-pointer transition-all"
                    onClick={() => handleUserClick(follower.id)}
                  >
                    <Avatar
                      src={follower.avatar || undefined}
                      alt={follower.username}
                      size="small"
                      fallback={getInitials(follower.first_name, follower.last_name)}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {follower.first_name} {follower.last_name}
                      </div>
                      <div className="text-xs text-slate-400">@{follower.username}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFollowAction(follower.id, follower.is_followed, 'follower')
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 
                        ${follower.is_followed
                          ? 'bg-gray-700/50 text-white hover:bg-red-600/80 hover:text-white'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                        }`}
                    >
                      {follower.is_followed ? 'Following' : 'Follow'}
                    </button>
                    <FiChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                  <FiUsers className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No followers yet</h3>
                <p className="text-gray-400">Share your profile to start building your audience</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Following Modal */}
      <Modal show={openModal === "following"} onClose={() => {
        setOpenModal(undefined);
        fetchFollowCounts(); // Update counts when modal closes
      }}>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl border border-slate-700">
          <div className="flex justify-between items-center p-5 border-b border-slate-700">
            <h3 className="text-xl font-semibold text-white">Following</h3>
            <button 
              className="text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all"
              onClick={() => setOpenModal(undefined)}
            >
              <FiX />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {followingLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
              </div>
            ) : following?.length > 0 ? (
              <div className="flex flex-col">
                {following.filter(follow => follow && follow.followed).map((follow) => (
                  <div 
                    key={follow.id} 
                    className="flex items-center gap-3 px-6 py-3 hover:bg-white/5 cursor-pointer transition-all"
                    onClick={() => handleUserClick(follow.followed.id)}
                  >
                    <Avatar
                      src={(follow.followed && follow.followed.avatar) || undefined}
                      alt={(follow.followed && follow.followed.username) || 'User'}
                      size="small"
                      fallback={getInitials(
                        (follow.followed && follow.followed.first_name) || '',
                        (follow.followed && follow.followed.last_name) || ''
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {(follow.followed && (follow.followed.first_name || follow.followed.last_name))
                          ? `${follow.followed.first_name || ''} ${follow.followed.last_name || ''}`
                          : 'No name provided'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {(follow.followed && follow.followed.username) ? `@${follow.followed.username}` : 'No username'}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFollowAction(follow.followed.id, true, 'following')
                      }}
                      className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105
                        bg-gray-700/50 text-white hover:bg-red-600/80 hover:text-white group"
                    >
                      <span className="group-hover:hidden">Following</span>
                      <span className="hidden group-hover:block">Unfollow</span>
                    </button>
                    <FiChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                  <FiUsers className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">You aren't following anyone</h3>
                <p className="text-gray-400">When you follow someone, you'll see them here</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
