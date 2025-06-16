<?php

namespace NSanden\LaravelInertiaReactBlog\Controllers;

use App\Http\Controllers\Controller;
use NSanden\LaravelInertiaReactBlog\Models\BlogPost;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $posts = BlogPost::with('author')
            ->published()
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        return Inertia::render('Blog/Index', [
            'posts' => $posts
        ]);
    }

    public function show(BlogPost $blogPost)
    {
        // Allow admin users to preview unpublished posts
        if (!$blogPost->is_published && (!auth()->check() || !auth()->user()->isAdmin())) {
            abort(404);
        }

        $blogPost->load('author');

        return Inertia::render('Blog/Show', [
            'post' => $blogPost
        ]);
    }
}