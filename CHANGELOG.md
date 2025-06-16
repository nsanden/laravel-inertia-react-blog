# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-06-16

### Added
- **Advanced Markdown Editor**: Full-featured markdown editor with toolbar and live preview
- **Image Search Integration**: Unsplash API integration for high-quality stock images
- **Enhanced Content Fields**: Added excerpt and featured_image fields to blog posts
- **Split-Screen Editing**: Real-time preview alongside markdown editor
- **Advanced UI Components**: BlogHeader, BlogAuthor, and ImageSearchModal components
- **Modern Blog Design**: Beautiful, responsive design with featured posts and grid layouts
- **Social Sharing**: Twitter, LinkedIn, and Facebook sharing buttons
- **Click-to-Edit**: Click paragraphs in preview to edit corresponding text in editor
- **Slug Management**: Automatic slug generation with manual override capability
- **Publish Scheduling**: Set specific publish dates and times
- **Enhanced Validation**: Comprehensive form validation for all new fields

### Enhanced
- **Blog Index Page**: Complete redesign with hero section, featured post, and recent posts grid
- **Blog Show Page**: Enhanced single post view with breadcrumbs and social sharing
- **Admin Interface**: Updated to use new AdvancedBlogForm with all new features
- **BlogPost Model**: Added support for excerpt, featured_image, and enhanced slug handling
- **Controllers**: Updated validation and handling for all new fields and functionality

### Database Changes
- Added migration for `excerpt` and `featured_image` fields in blog_posts table
- Enhanced slug support (already existed in v1.0 but now fully utilized)

### Breaking Changes
- Form components updated to use new AdvancedBlogForm instead of SimpleBlogForm
- Controller validation updated to handle new field structure
- Admin pages updated to support new functionality

## [1.0.0] - 2024-06-16

### Added
- Initial release of Laravel Inertia React Blog package
- Basic blog post management (title, content, author)
- Public blog listing and single post views
- Admin CRUD interface
- Author management with user linking
- Draft/Published status functionality
- Clean, minimal UI without icons or complex features
- Auto-discovery service provider
- Database migrations for blog_authors and blog_posts tables