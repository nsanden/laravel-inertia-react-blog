import { Head, Link, usePage } from '@inertiajs/react';
import BlogHeader from '@/Components/Blog/BlogHeader';

export default function Show({ post }) {
    const { auth } = usePage().props;
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Simple markdown rendering function
    const renderMarkdown = (text) => {
        if (!text) return '';
        
        let html = text
            // Headers
            .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.5rem; font-weight: 600; color: #1f2937; margin: 2.5rem 0 1rem 0; line-height: 1.4;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 style="font-size: 2rem; font-weight: 700; color: #1f2937; margin: 3rem 0 1.5rem 0; line-height: 1.3;">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 style="font-size: 2.5rem; font-weight: 700; color: #1f2937; margin: 2rem 0 1.5rem 0; line-height: 1.2;">$1</h1>')
            // Bold and italic
            .replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 600; color: #1f2937;">$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em style="font-style: italic;">$1</em>')
            // Images (must come before links since ![alt](url) contains [alt](url))
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); margin: 2.375rem auto; display: block;" />')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 2px;">$1</a>')
            // Code blocks
            .replace(/```([^`]*)```/g, '<pre style="background-color: #1e293b; color: #e2e8f0; padding: 1.5rem; border-radius: 0.75rem; overflow-x: auto; margin: 2rem 0; font-family: ui-monospace, SFMono-Regular, \'SF Mono\', Consolas, \'Liberation Mono\', Menlo, monospace;"><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code style="background-color: #f1f5f9; color: #1e293b; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-family: ui-monospace, SFMono-Regular, \'SF Mono\', Consolas, \'Liberation Mono\', Menlo, monospace; font-size: 0.875rem;">$1</code>')
            // Blockquotes
            .replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #3b82f6; padding: 1rem 0 1rem 2rem; margin: 2rem 0; font-style: italic; color: #6b7280; background-color: #f8fafc; border-radius: 0 0.5rem 0.5rem 0;">$1</blockquote>')
            .split('\n')
            .map(line => {
                if (line.trim().startsWith('- ')) {
                    return `<li style="margin-bottom: 0.75rem; color: #374151; line-height: 1.6;">${line.substring(2)}</li>`;
                } else if (line.trim().match(/^\d+\. /)) {
                    return `<li style="margin-bottom: 0.75rem; color: #374151; line-height: 1.6;">${line.replace(/^\d+\. /, '')}</li>`;
                }
                return line;
            })
            .join('\n')
            .replace(/(<li style="[^"]*">.*<\/li>\n?)+/g, match => {
                if (match.includes('- ')) {
                    return `<ul style="margin: 1.5rem 0; padding-left: 2rem;">${match}</ul>`;
                }
                return `<ol style="margin: 1.5rem 0; padding-left: 2rem;">${match}</ol>`;
            })
            .split('\n\n')
            .map((para, index) => {
                if (!para.trim()) return '';
                if (para.includes('<h1') || para.includes('<h2') || para.includes('<h3') || 
                    para.includes('<ul') || para.includes('<ol') || para.includes('<blockquote') ||
                    para.includes('<pre') || para.includes('<img')) {
                    return para;
                }
                return `<p style="font-size: 1.125rem; line-height: 1.75; color: #374151; margin-bottom: 1.75rem;">${para}</p>`;
            })
            .join('\n');
            
        return html;
    };

    return (
        <>
            <Head title={post.title} />
            
            {/* Header */}
            <section className="bg-gradient-to-r from-indigo-50 to-blue-100 pt-16 pb-20">
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
                                showFeaturedImage={false}
                            />
                            
                            {/* Admin Edit Button */}
                            {auth?.user?.is_admin && (
                                <div className="flex justify-center mb-6">
                                    <Link
                                        href={route('admin.blog.edit', post)}
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
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Featured Image */}
                        {post.featured_image ? (
                            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12">
                                <img 
                                    src={post.featured_image} 
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-64 md:h-96 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-2xl flex items-center justify-center mb-12">
                                <i className="fas fa-newspaper text-6xl text-indigo-600"></i>
                            </div>
                        )}

                        {/* Article Body */}
                        <div className="max-w-none">
                            <div 
                                className="markdown-content"
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                            />
                        </div>

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
        </>
    );
}