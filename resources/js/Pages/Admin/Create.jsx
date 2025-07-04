import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdvancedBlogForm from '@/Components/Blog/AdvancedBlogForm';
import BlogLayout from '@/Layouts/Blog/BlogLayout';
import { Head } from '@inertiajs/react';

export default function BlogCreate({ auth, authors }) {
    return (
        <BlogLayout>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create Blog Post
                    </h2>
                }
            >
                <Head title="Create Blog Post" />

                <div className="py-12">
                    <div className="max-w-[90%] mx-auto sm:px-6 lg:px-8">
                        <AdvancedBlogForm authors={authors} />
                    </div>
                </div>
            </AuthenticatedLayout>
        </BlogLayout>
    );
}