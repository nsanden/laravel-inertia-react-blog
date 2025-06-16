export default function BlogAuthor({ author, publishedAt, size = 'medium' }) {
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

    return (
        <div className={classes.container}>
            {/* Avatar placeholder or image */}
            <div className={`${classes.avatar} bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                {author?.avatar_url ? (
                    <img 
                        src={author.avatar_url} 
                        alt={author.name}
                        className={`${classes.avatar} rounded-full object-cover`}
                    />
                ) : (
                    <span className={`text-indigo-600 font-semibold ${size === 'large' ? 'text-lg' : size === 'medium' ? 'text-sm' : 'text-xs'}`}>
                        {author?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                )}
            </div>
            
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