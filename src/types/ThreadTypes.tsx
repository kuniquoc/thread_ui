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

export interface Comment {
    id: number;
    content: string;
    user: Thread['user'];
    created_at: string;
    likes_count: number;
    is_liked: boolean;
    replies_count: number;
}

export interface CommentListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Comment[];
}

export interface CreateCommentRequest {
    content: string;
    parent_comment_id?: number | null;
}

export interface LikeCommentResponse {
    likes_count: number;
    is_liked: boolean;
}
