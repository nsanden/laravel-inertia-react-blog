import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AiArticleBuilder from '@/Components/Blog/AiArticleBuilder';
import BlogLayout from '@/Layouts/Blog/BlogLayout';
import { Head } from '@inertiajs/react';

export default function BlogEditAi({ auth, post, authors }) {
    return (
        <BlogLayout>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Edit Blog Post with AI
                        </h2>
                        <a
                            href={route('blog-admin.edit', post)}
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                            Switch to Traditional Editor
                        </a>
                    </div>
                }
            >
                <Head title="Edit Blog Post with AI" />

                <div className="py-12">
                    <div className="max-w-[95%] mx-auto sm:px-6 lg:px-8">
                        <AiArticleBuilder 
                            post={post}
                            authors={authors} 
                            onCancel={() => window.history.back()}
                        />
                    </div>
                </div>
            </AuthenticatedLayout>
        </BlogLayout>
    );
}