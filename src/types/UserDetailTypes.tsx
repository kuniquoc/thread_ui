// Types for user details API
import { Thread } from './ThreadTypes';

export interface UserDetail {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
    threads: Thread[];
    reposted_threads: Thread[];
    is_followed: boolean;
    followers_count: number;
}

export interface UserDetailResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Thread[];
}
