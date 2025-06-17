import BlogAuthor from './BlogAuthor';

export default function BlogHeader({
    title,
    author,
    publishedAt,
    status,
    featuredImage = null,
    showFeaturedImage = true
}) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const displayDate = publishedAt ? formatDate(publishedAt) : formatDate(new Date());

    // Extract author data with fallbacks
    const authorName = author?.name || 'Nate Sanden';
    const authorImage = author?.avatar_url || '/images/nate-250.png';
    const authorTitle = author?.title || 'Author';

    return (
        <div className="mb-8">
            {showFeaturedImage && featuredImage && (
                <img
                    src={featuredImage}
                    alt={title || 'Featured image'}
                    className="w-full h-64 object-cover rounded-lg mb-8"
                />
            )}
            {title && (
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-gray-900">
                        {title}
                    </h1>

                    {/* Author & Date */}
                    <div className="flex items-center justify-center gap-6 text-gray-600 mb-8">
                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            <img
                                src={authorImage || '/images/nate-250.png'}
                                alt={authorName || 'Author'}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="text-left">
                                <p className="font-medium text-gray-900 text-lg">
                                    {authorName}
                                </p>
                                {authorTitle && (
                                    <p className="text-gray-600 text-sm">
                                        {authorTitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-8 w-px bg-gray-300"></div>

                        {/* Date & Status */}
                        <div>
                            <p className="font-medium text-gray-900">
                                {displayDate}
                            </p>
                            <p className="text-sm">{status === 'published' ? 'Published' : 'Draft'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}