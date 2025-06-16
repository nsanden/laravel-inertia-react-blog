import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SimpleBlogForm from '../../../Components/SimpleBlogForm';
import { Head } from '@inertiajs/react';

export default function BlogEdit({ auth, post, authors }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Blog Post</h2>}
        >
            <Head title="Edit Blog Post" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <SimpleBlogForm post={post} authors={authors} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}