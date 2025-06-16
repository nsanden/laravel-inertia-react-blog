# Laravel Inertia React Blog v2.0

An advanced blog package for Laravel with React/Inertia.js featuring comprehensive content management and modern editing capabilities.

## Features

### Content Management
- Advanced markdown editor with live preview
- Rich text formatting (bold, italic, headers, links, lists, code blocks, quotes)
- Split-screen editing with real-time preview
- Click-to-edit paragraph functionality
- Excerpt and featured image support
- Slug generation and editing
- Publish date/time scheduling

### Image Management
- Unsplash API integration for high-quality stock images
- Search and insert images directly into content
- Featured image support with preview
- Image replacement functionality
- Auto-attribution for Unsplash images

### Advanced UI/UX
- Beautiful, responsive design with modern styling
- Featured post display on blog index
- Grid layout for recent posts
- Social sharing buttons (Twitter, LinkedIn, Facebook)
- Breadcrumb navigation
- Draft/Published status indicators
- Admin edit buttons for authenticated users

### Technical Features
- Comprehensive markdown rendering
- Advanced form validation and error handling
- Clean component architecture
- SEO-friendly URLs with slugs
- Author management with user linking
- Pagination support

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

This version (2.0) represents a major upgrade from the minimal v1.0, adding all the advanced features mentioned above. Future enhancements could include:

- Categories/tags system
- Comment system
- Advanced SEO features
- Content caching
- Multi-language support
- Email newsletter integration

## License

MIT License