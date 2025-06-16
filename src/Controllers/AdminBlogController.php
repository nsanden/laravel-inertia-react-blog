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
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|url',
            'author_id' => 'required|exists:blog_authors,id',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        // Convert status to boolean
        $validated['is_published'] = $validated['status'] === 'published';
        unset($validated['status']);

        // Set published_at if publishing for the first time
        if ($validated['is_published'] && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
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
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug,' . $blogPost->id,
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|url',
            'author_id' => 'required|exists:blog_authors,id',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        // Convert status to boolean
        $validated['is_published'] = $validated['status'] === 'published';
        unset($validated['status']);

        // Set published_at if publishing for the first time
        if ($validated['is_published'] && !$blogPost->is_published && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        } elseif (!$validated['is_published']) {
            $validated['published_at'] = null;
        }

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
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