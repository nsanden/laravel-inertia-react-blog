import { useForm, usePage } from '@inertiajs/react';

export default function SimpleBlogForm({ post = null, authors = [], onCancel }) {
    const isEditing = !!post;
    const { auth } = usePage().props;
    
    // Find the current user's author or default to first author
    const getCurrentUserAuthor = () => {
        if (!auth?.user || !authors?.length) return '';
        
        // Try to find author linked to current user
        const userAuthor = authors.find(author => author.user_id === auth.user.id);
        if (userAuthor) return userAuthor.id;
        
        // Fallback to first available author
        return authors.length > 0 ? authors[0].id : '';
    };
    
    const { data, setData, post: submitPost, put, processing, errors } = useForm({
        title: post?.title || '',
        content: post?.content || '',
        author_id: post?.author_id || getCurrentUserAuthor(),
        is_published: post?.is_published || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            put(route('blog-admin.update', post));
        } else {
            submitPost(route('blog-admin.store'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                    {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows={10}
                        required
                    />
                    {errors.content && <div className="text-red-600 text-sm mt-1">{errors.content}</div>}
                </div>

                {/* Author */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <select
                        value={data.author_id}
                        onChange={(e) => setData('author_id', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="">Select an author...</option>
                        {authors?.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.name} - {author.title}
                            </option>
                        ))}
                    </select>
                    {errors.author_id && <div className="text-red-600 text-sm mt-1">{errors.author_id}</div>}
                </div>

                {/* Published Status */}
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.is_published}
                            onChange={(e) => setData('is_published', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Published</span>
                    </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onCancel || (() => window.history.back())}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Post' : 'Create Post')}
                    </button>
                </div>
            </form>
        </div>
    );
}