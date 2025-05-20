// User interface for thread authors
export interface Thread {
    id: number;
    content: string;
    user: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        date_joined: string;
        avatar: string | null;
    };
    thread_images: {
        id: number;
        image: string;
    }[];
    created_at: string;
    likes_count: number;
    is_liked: boolean;
    reposts_count: number;
    is_reposted: boolean;
    comment_count: number;
    parent_id?: number;
}

// Response for user threads endpoint
export interface UserThreadsParams {
    user_id: number;
    page?: number;
}

export interface ThreadsListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Thread[];
}

export interface CreateThreadRequest {
    content: string;
    images?: string[];
    parent_id?: number;
}

export interface LikeThreadResponse {
    likes_count: number;
    is_liked: boolean;
}

export interface RepostThreadResponse {
    reposts_count: number;
    is_reposted: boolean;
}