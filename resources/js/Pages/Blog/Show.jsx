import { Head, Link } from '@inertiajs/react';

export default function Show({ post }) {
    return (
        <>
            <Head title={post.title} />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <Link 
                        href={route('blog.index')}
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                        ← Back to Blog
                    </Link>
                </div>

                <article className="bg-white rounded-lg shadow p-8">
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                        
                        <div className="flex items-center text-gray-600">
                            <span>By {post.author.name}</span>
                            <span className="mx-2">•</span>
                            <span>{post.author.title}</span>
                            <span className="mx-2">•</span>
                            <time>{new Date(post.published_at).toLocaleDateString()}</time>
                        </div>
                    </header>

                    <div className="prose prose-lg max-w-none">
                        {post.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </article>
            </div>
        </>
    );
}