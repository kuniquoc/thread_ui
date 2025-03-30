import { PaginatedResponse } from './AppTypes';

// User interface for thread authors
export interface ThreadUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email?: string; // Optional as it may not be included in all responses
    avatar: string;
}

// Thread image interface
export interface ThreadImage {
    id: number;
    image: string;
}

// Thread interface
export interface Thread {
    id: number;
    content: string;
    user: ThreadUser;
    images: ThreadImage[];
    created_at: string;
    comments: any[]; // Can be refined if you have comment type details
    likes_count: number;
    is_liked: boolean;
    reposts_count: number;
    is_reposted: boolean;
    comment_count: number;
}

// Types for specific API responses
export type ThreadsListResponse = PaginatedResponse<Thread>;
export type ThreadFeedResponse = ThreadsListResponse; // Same structure as ThreadsListResponse
export type FollowingFeedResponse = ThreadsListResponse; // Same structure as ThreadsListResponse

// Request type for thread creation
export interface CreateThreadRequest {
    content: string;
    images?: string[]; // Optional array of image URLs
}

// Response type for thread creation
export type CreateThreadResponse = Thread;

// Response type for like/unlike action
export interface LikeThreadResponse {
    likes_count: number;
    is_liked: boolean;
}

// Response type for repost/unrepost action
export interface RepostThreadResponse {
    reposts_count: number;
    is_reposted: boolean;
}
