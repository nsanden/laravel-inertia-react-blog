<?php

namespace NSanden\LaravelInertiaReactBlog\Controllers;

use App\Http\Controllers\Controller;
use NSanden\LaravelInertiaReactBlog\Models\BlogPost;
use NSanden\LaravelInertiaReactBlog\Models\BlogAuthor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminBlogController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $posts = BlogPost::with('author')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/BlogIndex', [
            'posts' => $posts
        ]);
    }

    public function create()
    {
        $authors = BlogAuthor::all();
        
        // Auto-create author for current user if they're admin
        if (auth()->user()->isAdmin()) {
            BlogAuthor::findOrCreateForUser(auth()->user());
            $authors = BlogAuthor::all();
        }

        return Inertia::render('Admin/BlogCreate', [
            'authors' => $authors
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'author_id' => 'required|exists:blog_authors,id',
            'is_published' => 'boolean',
        ]);

        if ($validated['is_published']) {
            $validated['published_at'] = now();
        }

        BlogPost::create($validated);

        return redirect()->route('admin.blog.index');
    }

    public function edit(BlogPost $blogPost)
    {
        $authors = BlogAuthor::all();

        return Inertia::render('Admin/BlogEdit', [
            'post' => $blogPost,
            'authors' => $authors
        ]);
    }

    public function update(Request $request, BlogPost $blogPost)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'author_id' => 'required|exists:blog_authors,id',
            'is_published' => 'boolean',
        ]);

        if ($validated['is_published'] && !$blogPost->is_published) {
            $validated['published_at'] = now();
        } elseif (!$validated['is_published']) {
            $validated['published_at'] = null;
        }

        $blogPost->update($validated);

        return redirect()->route('admin.blog.index');
    }

    public function destroy(BlogPost $blogPost)
    {
        $blogPost->delete();

        return redirect()->route('admin.blog.index');
    }
}