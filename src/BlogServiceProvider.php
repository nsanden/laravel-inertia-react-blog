<?php

namespace NSanden\LaravelInertiaReactBlog;

use Illuminate\Support\ServiceProvider;

class BlogServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        // Load routes
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        
        // Load migrations
        $this->loadMigrationsFrom(__DIR__.'/database/migrations');
        
        // Publish assets
        $this->publishes([
            __DIR__.'/../resources/js' => resource_path('js/vendor/laravel-inertia-react-blog'),
        ], 'laravel-inertia-react-blog-assets');
    }
}