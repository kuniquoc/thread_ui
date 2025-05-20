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

export interface ForgotPasswordRequest {
    email: string;
    username: string;
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
    avatar: string;
    is_followed: boolean;
}

