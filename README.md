# Laravel Inertia React Blog

A minimal blog package for Laravel with React/Inertia.js support.

## Features

- Simple blog post management (title, content, author)
- Public blog listing and single post views
- Admin CRUD interface
- Author management with user linking
- Draft/Published status
- Clean, minimal UI without icons or complex features

## Installation

### Via Composer (from Packagist)

```bash
composer require nsanden/laravel-inertia-react-blog
```

### Via GitHub (before Packagist submission)

Add to your project's `composer.json`:

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/nsanden/laravel-inertia-react-blog"
        }
    ],
    "require": {
        "nsanden/laravel-inertia-react-blog": "^1.0"
    }
}
```

Then run:

```bash
composer install
```

### Post-Installation

1. Run migrations:

```bash
php artisan migrate
```

2. Publish the React components (optional, for customization):

```bash
php artisan vendor:publish --tag=laravel-inertia-react-blog-assets
```

## Usage

### Routes

- `/blog` - Public blog listing
- `/blog/{slug}` - Single blog post
- `/admin/blog` - Admin blog management (requires auth)

### Requirements

- PHP ^8.1
- Laravel ^10.0
- React with Inertia.js
- User model with `isAdmin()` method

### Customization

The package publishes React components to `resources/js/vendor/laravel-inertia-react-blog/` which you can customize as needed.

## GitHub Setup

To publish this package to GitHub:

1. Create a new repository: `https://github.com/nsanden/laravel-inertia-react-blog`
2. Initialize git in the package directory
3. Add, commit, and push the code
4. Create a release tag (e.g. `v1.0.0`)
5. Submit to Packagist for auto-discovery

## Development

This is a minimal "hello world" version. Future enhancements could include:

- Markdown support
- Image handling
- Categories/tags
- SEO features
- Advanced editor
- Caching

## License

MIT License