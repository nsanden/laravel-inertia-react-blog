import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdvancedBlogForm from '@/Components/Blog/AdvancedBlogForm';
import BlogLayout from '@/Layouts/Blog/BlogLayout';
import { Head } from '@inertiajs/react';

export default function BlogEdit({ auth, post, authors }) {
    return (
        <BlogLayout>
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Blog Post</h2>}
            >
                <Head title="Edit Blog Post" />

                <div className="py-12">
                    <div className="max-w-[90%] mx-auto sm:px-6 lg:px-8">
                        <AdvancedBlogForm post={post} authors={authors} />
                    </div>
                </div>
            </AuthenticatedLayout>
        </BlogLayout>
    );
}