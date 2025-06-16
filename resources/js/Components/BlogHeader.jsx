import BlogAuthor from './BlogAuthor';

export default function BlogHeader({ 
    title, 
    author, 
    publishedAt, 
    status, 
    featuredImage = null, 
    showFeaturedImage = true 
}) {
    return (
        <div>
            <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex-1">{title}</h1>
                {status === 'draft' && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-4 flex-shrink-0">
                        DRAFT
                    </span>
                )}
            </div>
            
            {author && (
                <div className="mb-6">
                    <BlogAuthor 
                        author={author}
                        publishedAt={publishedAt}
                        size="large"
                    />
                </div>
            )}
            
            {featuredImage && showFeaturedImage && (
                <div className="mb-8">
                    <img 
                        src={featuredImage} 
                        alt={title}
                        className="w-full h-64 md:h-96 object-cover rounded-xl"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}
        </div>
    );
}