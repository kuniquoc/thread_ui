// Auth Types
export interface UserRegistrationRequest {
	username: string;
	password: string;
	password2: string;
	email: string;
	first_name: string;
	last_name: string;
}

export interface UserLoginRequest {
	username: string;
	password: string;
}

export interface UserUpdateRequest {
	email?: string;
	first_name?: string;
	last_name?: string;
	avatar?: string;
	bio?: string;
}

export interface ChangePasswordRequest {
	old_password: string;
	new_password: string;
	new_password2: string;
}

export interface UserResponse {
	id: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	date_joined: string;
	avatar: string | null;
}

export interface ApiResponse<T> {
	status: string;
	data: T;
}

export interface PaginatedResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}

// Thread Types
export interface ThreadUserType {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	avatar: string | null;
}

export interface ThreadImageType {
	id: number;
	image: string;
}

export interface ThreadType {
	id: number;
	content: string;
	threadContent?: string;
	user: ThreadUserType;
	username?: string;
	avatar?: string | null;
	images: ThreadImageType[];
	created_at: string;
	publishTime?: string;
	likes_count: number;
	totalLikes?: number;
	is_liked: boolean;
	isLiked?: boolean;
	reposts_count: number;
	is_reposted: boolean;
	isReposted?: boolean;
	comment_count: number;
	totalReplies?: number;
	comments: CommentType[];
	isVerified?: boolean;
	mentions?: string;
	repostedBy?: string;
	carousel?: ThreadImageType[];
}

export interface ThreadCreateRequest {
	content: string;
	images?: string[];
}

export interface ThreadActionResponse {
	likes_count: number;
	is_liked: boolean;
	reposts_count: number;
	is_reposted: boolean;
}

// Comment Types
export interface CommentUserType {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	avatar: string | null;
}

export interface CommentType {
	id: number;
	content: string;
	user: ThreadUserType;
	created_at: string;
	likes_count: number;
	is_liked: boolean;
	replies_count: number;
	parent_comment_id?: number | null;
}

export interface CommentCreateRequest {
	content: string;
	parent_comment_id: number | null;
}

export interface CommentActionResponse {
	likes_count: number;
	is_liked: boolean;
}

export interface CommentRepostResponse {
	reposts_count: number;
	is_reposted: boolean;
}

// Follow Types
export interface FollowUserType {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	avatar: string | null;
}

export interface FollowType {
	id: number;
	follower: ThreadUserType;
	followed: ThreadUserType;
	created_at: string;
	status?: string;
}

export interface FollowRequest {
	followed_id: number;
}

export interface FollowResponse extends FollowType {
	status: string;
}

export interface FollowCountResponse {
	count: number;
}

// Notification Types
export interface NotificationUserType {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	avatar: string | null;
}

export interface NotificationType {
	id: number;
	user: ThreadUserType;
	actioner: ThreadUserType;
	content: string;
	created_at: string;
	is_read: boolean;
}

export interface NotificationReadResponse {
	id: number;
	is_read: boolean;
}

export interface NotificationCountResponse {
	count: number;
}

export interface NotificationMarkAllReadResponse {
	message: string;
}

// JWT Auth Types
export interface AuthResponse {
	user: UserResponse;
	tokens: {
		refresh: string;
		access: string;
	};
}

// Error Response Type
export interface ApiErrorResponse {
	status: string;
	errors: Record<string, string>;
}
export interface ThreadRepostResponse {
	success: boolean;
	message: string;
	reposted: boolean;
	repost_count: number;
}