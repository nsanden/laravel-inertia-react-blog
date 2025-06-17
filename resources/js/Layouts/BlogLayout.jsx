import { Head } from '@inertiajs/react';

export default function BlogLayout({ children }) {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="/css/fontawesome.css" />
            </Head>
            {children}
        </>
    );
}