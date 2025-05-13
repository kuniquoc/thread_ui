import { useState } from 'react';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const useImageUpload = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Upload single image to ImgBB
    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            if (!IMGBB_API_KEY) {
                throw new Error('ImgBB API key is not configured');
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('key', IMGBB_API_KEY);
            
            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to upload image');
            }

            return result.data.url;
        } catch (err) {
            console.error('Error uploading image:', err);
            return null;
        }
    };

    // Upload multiple images and return array of URLs
    const uploadImages = async (files: File[]): Promise<string[]> => {
        setLoading(true);
        setError(null);
        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const results = await Promise.all(uploadPromises);
            // Filter out null values (failed uploads)
            return results.filter((url): url is string => url !== null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload images');
            return [];
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        uploadImage,
        uploadImages
    };
};