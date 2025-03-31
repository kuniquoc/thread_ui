import { useState } from 'react';

interface CommentInputProps {
    avatar: string;
    onSubmit: (content: string) => Promise<void>;
    placeholder?: string;
}

const CommentInput = ({
    avatar,
    onSubmit,
    placeholder = "Post your reply"
}: CommentInputProps) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent(''); // Clear input after successful submission
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4 flex items-start gap-2">
            <img
                src={avatar}
                width={30}
                height={30}
                alt="Your Avatar"
                className="rounded-full mt-1"
            />
            <form onSubmit={handleSubmit} className="flex-1">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent border border-gray-600 rounded-lg p-2 text-sm resize-none"
                    placeholder={placeholder}
                    rows={2}
                ></textarea>
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={!content.trim() || isSubmitting}
                        className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium disabled:opacity-50"
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentInput;
