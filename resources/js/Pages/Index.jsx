import { Head, Link, usePage } from '@inertiajs/react';
import BlogAuthor from '@/Components/Blog/BlogAuthor';
import BlogLayout from '@/Layouts/Blog/BlogLayout';

export default function Index({ posts }) {
    const { auth } = usePage().props;
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getExcerpt = (post, length = 150) => {
        if (post.excerpt) {
            return post.excerpt;
        }
        const plainText = post.content.replace(/<[^>]*>/g, '').replace(/[#*]/g, '');
        return plainText.length > length ? plainText.substring(0, length) + '...' : plainText;
    };

    return (
        <BlogLayout>
            <Head title="Blog" />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-50 to-blue-100 pt-16 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-indigo-600">Blog</h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-10">Latest articles, insights, and expert advice</p>
                        {auth?.user?.is_admin && (
                            <Link
                                href={route('blog-admin.create')}
                                className="mb-10 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                                title="Create new blog post"
                            >
                                <i className="fas fa-plus"></i>
                                Create Post
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {posts.data && posts.data.length > 0 ? (
                <>
                    {/* Featured Post */}
                    <section className="py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-6xl mx-auto">
                                <h2 className="text-3xl font-bold mb-12 text-center">Featured Article</h2>
                                <Link 
                                    href={route('blog.show', posts.data[0].slug)}
                                    className={`block bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer ${!posts.data[0].is_published ? 'opacity-60' : ''}`}
                                >
                                    <div className="md:flex">
                                        <div className="md:w-1/2">
                                            {posts.data[0].featured_image ? (
                                                <img 
                                                    src={posts.data[0].featured_image} 
                                                    alt={posts.data[0].title}
                                                    className="w-full h-64 md:h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-64 md:h-full bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
                                                    <i className="fas fa-newspaper text-6xl text-indigo-600"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="md:w-1/2 p-8 md:p-12">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-2xl md:text-3xl font-bold">{posts.data[0].title}</h3>
                                                {!posts.data[0].is_published && auth?.user?.is_admin && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
                                                        DRAFT
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-6">{getExcerpt(posts.data[0])}</p>
                                            <div className="flex items-center justify-between">
                                                <BlogAuthor 
                                                    author={posts.data[0].author}
                                                    publishedAt={posts.data[0].published_at}
                                                    size="medium"
                                                />
                                                <div className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg">
                                                    Read More
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Recent Posts Grid */}
                    {posts.data.length > 1 && (
                        <section className="py-20 bg-gray-50">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="max-w-6xl mx-auto">
                                    <h2 className="text-3xl font-bold mb-12 text-center">Recent Articles</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {posts.data.slice(1).map((post) => (
                                            <Link
                                                key={post.id}
                                                href={route('blog.show', post.slug)}
                                                className={`block bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer ${!post.is_published ? 'opacity-60' : ''}`}
                                            >
                                                {post.featured_image ? (
                                                    <img 
                                                        src={post.featured_image} 
                                                        alt={post.title}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
                                                        <i className="fas fa-newspaper text-4xl text-indigo-600"></i>
                                                    </div>
                                                )}
                                                <div className="p-6">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <h3 className="text-xl font-bold line-clamp-2 flex-1">{post.title}</h3>
                                                        {!post.is_published && auth?.user?.is_admin && (
                                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full ml-2 flex-shrink-0">
                                                                DRAFT
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 mb-4 line-clamp-3">{getExcerpt(post)}</p>
                                                    <div className="flex items-center justify-between">
                                                        <BlogAuthor 
                                                            author={post.author}
                                                            publishedAt={post.published_at}
                                                            size="small"
                                                        />
                                                        <div className="text-indigo-600 font-medium text-sm">
                                                            Read More
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Pagination */}
                    {posts.links && posts.links.length > 3 && (
                        <section className="py-10">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-center">
                                    <nav className="flex space-x-2">
                                        {posts.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-4 py-2 rounded-lg transition ${
                                                    link.active 
                                                        ? 'bg-indigo-600 text-white' 
                                                        : link.url 
                                                            ? 'bg-white text-indigo-600 border hover:bg-indigo-50' 
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </section>
                    )}
                </>
            ) : (
                /* No Posts Message */
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fas fa-newspaper text-3xl text-gray-400"></i>
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">No blog posts yet</h2>
                            <p className="text-gray-600">We're working on creating great content for you. Check back soon!</p>
                        </div>
                    </div>
                </section>
            )}
        </BlogLayout>
    );
}