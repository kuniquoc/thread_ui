export interface CommentUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
}

export interface Comment {
    id: number;
    content: string;
    user: CommentUser;
    created_at: string;
    likes_count: number;
    is_liked: boolean;
    replies_count: number;
    reposts_count?: number;
    is_reposted?: boolean;
}

export interface CommentsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Comment[];
}

export type RepliesResponse = Comment[];

export interface CreateCommentRequest {
    content: string;
    parent_comment_id: number | null;
}

export interface CreateCommentResponse extends Comment {
    // Same structure as Comment, but explicitly defined for clarity
}

export interface LikeCommentResponse {
    likes_count: number;
    is_liked: boolean;
}

export interface RepostCommentResponse {
    reposts_count: number;
    is_reposted: boolean;
}
