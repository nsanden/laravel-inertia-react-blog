import { Head, Link, usePage } from '@inertiajs/react';
import BlogHeader from '@/Components/Blog/BlogHeader';
import BlogLayout from '@/Layouts/Blog/BlogLayout';
import MarkdownRenderer from '@/Components/Blog/MarkdownRenderer';

export default function Show({ post }) {
    const { auth } = usePage().props;
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    return (
        <BlogLayout>
            <Head title={post.title} />
            
            {/* Header */}
            <section className="bg-gradient-to-r from-indigo-50 to-blue-100 pt-16 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb */}
                        <nav className="mb-8">
                            <ol className="flex items-center space-x-2 text-sm">
                                <li>
                                    <Link href="/" className="text-indigo-600 hover:text-indigo-700">
                                        Home
                                    </Link>
                                </li>
                                <li className="text-gray-500">/</li>
                                <li>
                                    <Link href={route('blog.index')} className="text-indigo-600 hover:text-indigo-700">
                                        Blog
                                    </Link>
                                </li>
                                <li className="text-gray-500">/</li>
                                <li className="text-gray-700">{post.title}</li>
                            </ol>
                        </nav>

                        {/* Article Header */}
                        <div className="text-center">
                            <BlogHeader 
                                title={post.title}
                                author={post.author}
                                publishedAt={post.published_at}
                                status={post.is_published ? 'published' : 'draft'}
                                featuredImage={post.featured_image}
                                showFeaturedImage={true}
                            />
                            
                            {/* Admin Edit Button */}
                            {auth?.user?.is_admin && (
                                <div className="flex justify-center mb-6">
                                    <Link
                                        href={route('blog-admin.edit', post)}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                                    >
                                        <i className="fas fa-edit"></i>
                                        Edit
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">

                        {/* Article Body */}
                        <MarkdownRenderer content={post.content} />

                        {/* Share Buttons */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
                            <div className="flex gap-4">
                                <a 
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                                >
                                    <i className="fab fa-x-twitter"></i>
                                    X
                                </a>
                                <a 
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                                >
                                    <i className="fab fa-linkedin"></i>
                                    LinkedIn
                                </a>
                                <a 
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    <i className="fab fa-facebook"></i>
                                    Facebook
                                </a>
                            </div>
                        </div>

                        {/* Back to Blog */}
                        <div className="mt-16 text-center">
                            <Link 
                                href={route('blog.index')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                            >
                                <i className="fas fa-arrow-left"></i>
                                Back to Blog
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </BlogLayout>
    );
}