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
        
        // Publish assets to namespaced folders
        $this->publishes([
            __DIR__.'/../resources/js/Pages' => resource_path('js/Pages/Blog'),
            __DIR__.'/../resources/js/Components' => resource_path('js/Components/Blog'),
        ], 'laravel-inertia-react-blog');
    }
}