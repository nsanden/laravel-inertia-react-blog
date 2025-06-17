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
        // Load migrations
        $this->loadMigrationsFrom(__DIR__.'/database/migrations');
        
        // Publish assets to namespaced folders
        $this->publishes([
            __DIR__.'/../resources/js/Pages' => resource_path('js/Pages/Blog'),
            __DIR__.'/../resources/js/Components' => resource_path('js/Components/Blog'),
            __DIR__.'/../resources/js/Layouts' => resource_path('js/Layouts/Blog'),
            __DIR__.'/../node_modules/@fortawesome/fontawesome-free/css/all.min.css' => public_path('css/fontawesome.css'),
            __DIR__.'/../node_modules/@fortawesome/fontawesome-free/webfonts' => public_path('webfonts'),
        ], 'laravel-inertia-react-blog');

        // Publish the routes file
        $this->publishes([
            __DIR__.'/../routes/web.php' => base_path('routes/blog.php'),
        ], 'laravel-inertia-react-blog-routes');
    }
}