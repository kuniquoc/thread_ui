// import { useState } from 'react';
// import { CommentType, CommentCreateRequest, CommentActionResponse, ApiResponse, PaginatedResponse } from '../types/AppTypes';
// import { API_BASE_URL } from '../config/api';

// const API_URL = `${API_BASE_URL}/api`;

// export const useComment = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const getComments = async (threadId: number): Promise<ApiResponse<PaginatedResponse<CommentType>> | null> => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_URL}/threads/${threadId}/comments`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//             });
//             const result = await response.json();
//             if (!response.ok) {
//                 throw new Error(result.message || 'Failed to fetch comments');
//             }
//             return result;
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to fetch comments');
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const createComment = async (threadId: number, data: CommentCreateRequest): Promise<ApiResponse<CommentType> | null> => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_URL}/threads/${threadId}/comments`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify(data),
//             });
//             const result = await response.json();
//             if (!response.ok) {
//                 throw new Error(result.message || 'Failed to create comment');
//             }
//             return result;
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to create comment');
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getReplies = async (commentId: number): Promise<ApiResponse<PaginatedResponse<CommentType>> | null> => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_URL}/comments/${commentId}/replies`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//             });
//             const result = await response.json();
//             if (!response.ok) {
//                 throw new Error(result.message || 'Failed to fetch replies');
//             }
//             return result;
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to fetch replies');
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const likeComment = async (commentId: number): Promise<ApiResponse<CommentActionResponse> | null> => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_URL}/comments/${commentId}/like`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//             });
//             const result = await response.json();
//             if (!response.ok) {
//                 throw new Error(result.message || 'Failed to like comment');
//             }
//             return result;
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to like comment');
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         loading,
//         error,
//         getComments,
//         createComment,
//         getReplies,
//         likeComment,
//     };
// };