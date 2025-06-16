<?php

use Illuminate\Support\Facades\Route;
use NSanden\LaravelInertiaReactBlog\Controllers\BlogController;
use NSanden\LaravelInertiaReactBlog\Controllers\AdminBlogController;

// Public blog routes
Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/', [BlogController::class, 'index'])->name('index');
    Route::get('/{blogPost}', [BlogController::class, 'show'])->name('show');
});

// Admin blog routes
Route::prefix('blog-admin')->name('blog-admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [AdminBlogController::class, 'index'])->name('index');
    Route::get('/create', [AdminBlogController::class, 'create'])->name('create');
    Route::post('/', [AdminBlogController::class, 'store'])->name('store');
    Route::get('/{blogPost}/edit', [AdminBlogController::class, 'edit'])->name('edit');
    Route::put('/{blogPost}', [AdminBlogController::class, 'update'])->name('update');
    Route::delete('/{blogPost}', [AdminBlogController::class, 'destroy'])->name('destroy');
});