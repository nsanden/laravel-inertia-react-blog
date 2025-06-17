import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BlogLayout from '@/Layouts/Blog/BlogLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function AuthorEdit({ auth, author }) {
    const { data, setData, put, processing, errors } = useForm({
        name: author.name || '',
        title: author.title || '',
        user_id: author.user_id || '',
        avatar_url: author.avatar_url || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('blog-admin.authors.update', author));
    };

    return (
        <BlogLayout>
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Author</h2>}
            >
                <Head title="Edit Author" />

                <div className="py-12">
                    <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Edit Author</h1>
                                    <Link
                                        href={route('blog-admin.authors.index')}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    >
                                        Back to Authors
                                    </Link>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Name" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="title" value="Title" />
                                        <TextInput
                                            id="title"
                                            type="text"
                                            name="title"
                                            value={data.title}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.title} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-600">
                                            The title or role of this author (e.g., "Senior Writer", "Editor", "Guest Contributor")
                                        </p>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="avatar_url" value="Avatar URL (Optional)" />
                                        <TextInput
                                            id="avatar_url"
                                            type="url"
                                            name="avatar_url"
                                            value={data.avatar_url}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('avatar_url', e.target.value)}
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                        <InputError message={errors.avatar_url} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-600">
                                            Optional: URL to the author's profile picture
                                        </p>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="user_id" value="Link to User Account (Optional)" />
                                        <TextInput
                                            id="user_id"
                                            type="number"
                                            name="user_id"
                                            value={data.user_id}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('user_id', e.target.value)}
                                        />
                                        <InputError message={errors.user_id} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-600">
                                            Optional: Enter a user ID to link this author to an existing user account
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end">
                                        <PrimaryButton className="ml-4" disabled={processing}>
                                            Update Author
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </BlogLayout>
    );
}