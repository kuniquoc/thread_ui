export interface UserSummary {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
    date_joined?: string;
}

export interface Follow {
    id: number;
    follower: UserSummary;
    followed: UserSummary;
    created_at: string;
    status?: string; // Only present in follow/unfollow response
}

export interface FollowsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Follow[];
}

export interface FollowRequest {
    followed_id: number;
}

export interface FollowersCountResponse {
    count: number;
}
