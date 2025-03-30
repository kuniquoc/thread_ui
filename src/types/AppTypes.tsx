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

