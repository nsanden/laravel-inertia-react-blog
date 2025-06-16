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
        
        // Publish pages to main Pages directory
        $this->publishes([
            __DIR__.'/../resources/js/Pages' => resource_path('js/Pages'),
        ], 'laravel-inertia-react-blog-pages');

        // Publish components to vendor directory (for customization)
        $this->publishes([
            __DIR__.'/../resources/js/Components' => resource_path('js/vendor/laravel-inertia-react-blog/Components'),
        ], 'laravel-inertia-react-blog-components');

        // Publish all assets (pages + components)
        $this->publishes([
            __DIR__.'/../resources/js' => resource_path('js/vendor/laravel-inertia-react-blog'),
        ], 'laravel-inertia-react-blog-assets');
    }
}