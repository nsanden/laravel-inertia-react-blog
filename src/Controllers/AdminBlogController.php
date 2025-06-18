<?php

namespace NSanden\LaravelInertiaReactBlog\Controllers;

use App\Http\Controllers\Controller;
use NSanden\LaravelInertiaReactBlog\Models\BlogPost;
use NSanden\LaravelInertiaReactBlog\Models\BlogAuthor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\ChatGptService;

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

        return Inertia::render('Blog/Admin/Index', [
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

        return Inertia::render('Blog/Admin/Create', [
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

        return redirect()->route('blog-admin.index');
    }

    public function edit(BlogPost $blogPost)
    {
        $authors = BlogAuthor::all();

        $response = Inertia::render('Blog/Admin/Edit', [
            'post' => $blogPost->fresh(),  // Ensure fresh data from DB
            'authors' => $authors
        ]);

        return $response->toResponse(request())
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            ->header('Pragma', 'no-cache');
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

        return redirect()->route('blog-admin.index')
            ->with('success', 'Blog post updated successfully')
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            ->header('Pragma', 'no-cache');
    }


    public function destroy(BlogPost $blogPost)
    {
        $blogPost->delete();

        return redirect()->route('blog-admin.index');
    }

    public function modifyContent(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'user_request' => 'required|string',
            'title' => 'nullable|string',
            'chat_history' => 'nullable|array',
        ]);

        try {
            // Log the user request to see if context is included
            \Log::info('Blog modify request', [
                'user_request' => $request->input('user_request'),
                'has_context' => str_contains($request->input('user_request'), 'Context:')
            ]);

            $chatGptService = new ChatGptService();
            $result = $chatGptService->modifyBlogContent(
                $request->input('content'),
                $request->input('user_request'),
                $request->input('title', ''),
                $request->input('chat_history', [])
            );

            return response()->json([
                'success' => true,
                'content' => $result['content'],
                'message' => $result['message'],
                'isModification' => $result['isModification'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to modify content. Please try again.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function chatWithAI(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'content' => 'nullable|string',
            'title' => 'nullable|string',
            'chat_history' => 'nullable|array',
        ]);

        try {
            $chatGptService = new ChatGptService();
            $result = $chatGptService->chatWithAI(
                $request->input('message'),
                $request->input('content', ''),
                $request->input('title', ''),
                $request->input('chat_history', [])
            );

            return response()->json([
                'success' => true,
                'response' => $result['response'],
                'is_chat' => $result['is_chat'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to chat with AI. Please try again.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}