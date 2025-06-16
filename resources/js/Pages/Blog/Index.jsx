import { Head, Link } from '@inertiajs/react';

export default function Index({ posts }) {
    return (
        <>
            <Head title="Blog" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
                    <p className="mt-2 text-lg text-gray-600">Latest articles and insights</p>
                </div>

                <div className="grid gap-8">
                    {posts.data.map((post) => (
                        <article key={post.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-gray-500">
                                    By {post.author.name} • {new Date(post.published_at).toLocaleDateString()}
                                </div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                <Link 
                                    href={route('blog.show', post)}
                                    className="hover:text-indigo-600"
                                >
                                    {post.title}
                                </Link>
                            </h2>
                            
                            <div className="prose prose-gray max-w-none">
                                <p>{post.content.substring(0, 200)}...</p>
                            </div>
                            
                            <div className="mt-4">
                                <Link 
                                    href={route('blog.show', post)}
                                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                                >
                                    Read more →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination */}
                {posts.links && (
                    <div className="mt-12">
                        <nav className="flex justify-center">
                            <div className="flex space-x-1">
                                {posts.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm ${
                                            link.active 
                                                ? 'bg-indigo-600 text-white' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
}