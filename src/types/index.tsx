export * from './AppTypes';
export * from './AuthTypes';
export * from './CommentTypes';
export * from './ThreadTypes';
export * from './FollowTypes';
export * from './NotificationTypes';

export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    is_followed: boolean;
}

export interface SearchUserResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
}
