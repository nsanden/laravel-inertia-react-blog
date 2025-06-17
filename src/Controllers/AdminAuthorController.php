<?php

namespace NSanden\LaravelInertiaReactBlog\Controllers;

use App\Http\Controllers\Controller;
use NSanden\LaravelInertiaReactBlog\Models\BlogAuthor;
use NSanden\LaravelInertiaReactBlog\Requests\AuthorRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAuthorController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $authors = BlogAuthor::with('user')
            ->withCount('posts')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Blog/Admin/Authors/Index', [
            'authors' => $authors
        ]);
    }

    public function create()
    {
        return Inertia::render('Blog/Admin/Authors/Create');
    }

    public function store(AuthorRequest $request)
    {
        BlogAuthor::create($request->validated());

        return redirect()->route('blog-admin.authors.index')
            ->with('success', 'Author created successfully.');
    }

    public function edit(BlogAuthor $author)
    {
        return Inertia::render('Blog/Admin/Authors/Edit', [
            'author' => $author
        ]);
    }

    public function update(AuthorRequest $request, BlogAuthor $author)
    {
        $author->update($request->validated());

        return redirect()->route('blog-admin.authors.index')
            ->with('success', 'Author updated successfully.');
    }

    public function destroy(BlogAuthor $author)
    {
        // Check if author has posts
        if ($author->posts()->count() > 0) {
            return redirect()->route('blog-admin.authors.index')
                ->with('error', 'Cannot delete author with existing posts.');
        }

        $author->delete();

        return redirect()->route('blog-admin.authors.index')
            ->with('success', 'Author deleted successfully.');
    }
}