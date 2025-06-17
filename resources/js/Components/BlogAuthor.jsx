export default function BlogAuthor({ author, publishedAt, status, size = 'medium', layout = 'inline' }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const sizeClasses = {
        small: {
            container: 'flex items-center gap-2',
            avatar: 'w-6 h-6',
            name: 'text-sm font-medium text-gray-900',
            meta: 'text-xs text-gray-500'
        },
        medium: {
            container: 'flex items-center gap-3',
            avatar: 'w-8 h-8',
            name: 'text-base font-medium text-gray-900',
            meta: 'text-sm text-gray-500'
        },
        large: {
            container: 'flex items-center gap-4',
            avatar: 'w-12 h-12',
            name: 'text-lg font-semibold text-gray-900',
            meta: 'text-base text-gray-600'
        }
    };

    const classes = sizeClasses[size];

    // Enhanced layout with separator for blog posts
    if (layout === 'enhanced') {
        return (
            <div className="flex items-center justify-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-3">
                    {author?.avatar_url ? (
                        <img 
                            src={author.avatar_url} 
                            alt={author?.name || 'Author'}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-600 font-semibold text-lg">
                                {author?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                        </div>
                    )}
                    <div className="text-left">
                        <p className="font-medium text-gray-900 text-lg">
                            {author?.name || 'Anonymous'}
                        </p>
                        <p className="text-gray-600 text-sm">
                            {author?.title || 'Author'}
                        </p>
                    </div>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div>
                    <p className="font-medium text-gray-900">
                        {publishedAt ? formatDate(publishedAt) : 'Not published'}
                    </p>
                    {status && (
                        <p className="text-sm">
                            {status}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Default inline layout
    return (
        <div className={classes.container}>
            {author?.avatar_url ? (
                <img 
                    src={author.avatar_url} 
                    alt={author?.name || 'Author'}
                    className={`${classes.avatar} rounded-full object-cover flex-shrink-0`}
                />
            ) : (
                <div className={`${classes.avatar} bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-indigo-600 font-semibold ${size === 'large' ? 'text-lg' : size === 'medium' ? 'text-sm' : 'text-xs'}`}>
                        {author?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                </div>
            )}
            
            <div className="flex-1 min-w-0">
                <div className={classes.name}>
                    {author?.name || 'Anonymous'}
                </div>
                <div className={classes.meta}>
                    {author?.title && (
                        <>
                            {author.title}
                            {publishedAt && ' • '}
                        </>
                    )}
                    {publishedAt && formatDate(publishedAt)}
                </div>
            </div>
        </div>
    );
}