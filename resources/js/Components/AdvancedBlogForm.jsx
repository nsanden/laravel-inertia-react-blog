import { useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import ImageSearchModal from '@/Components/Blog/ImageSearchModal';
import MarkdownRenderer from '@/Components/Blog/MarkdownRenderer';
import BlogHeader from '@/Components/Blog/BlogHeader';
import ChatInterface from '@/Components/Blog/ChatInterface';

export default function AdvancedBlogForm({ post = null, authors = [], onCancel }) {
    const isEditing = !!post;
    const { auth } = usePage().props;
    
    // Find author that matches current user
    const getCurrentUserAuthor = () => {
        if (!auth?.user || !authors?.length) return '';
        
        // Try to match by name (case insensitive)
        const userFirstName = auth.user.first_name?.toLowerCase();
        const matchingAuthor = authors.find(author => 
            author.name.toLowerCase().includes(userFirstName) ||
            author.name.toLowerCase() === auth.user.name?.toLowerCase()
        );
        
        return matchingAuthor ? matchingAuthor.id : (authors.length > 0 ? authors[0].id : '');
    };
    
    const { data, setData, post: submitPost, put, processing, errors } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        content: post?.content || '',
        excerpt: post?.excerpt || '',
        featured_image: post?.featured_image || '',
        author_id: post?.author_id || getCurrentUserAuthor(),
        status: post?.is_published ? 'published' : 'draft',
        published_at: post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    });

    const contentRef = useRef(null);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
    const [imageSearchOpen, setImageSearchOpen] = useState(false);
    const [contentImageSearchOpen, setContentImageSearchOpen] = useState(false);
    const [editingImageUrl, setEditingImageUrl] = useState(null);
    const [editingImageIndex, setEditingImageIndex] = useState(null);
    const [contentMode, setContentMode] = useState('chat'); // 'chat' or 'markdown'
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setData('title', newTitle);
        
        if (!slugManuallyEdited && newTitle) {
            setData('slug', generateSlug(newTitle));
        }
    };

    const handleSlugChange = (e) => {
        setSlugManuallyEdited(true);
        setData('slug', e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const options = {
            preserveScroll: false,
            preserveState: false,
            onSuccess: () => {
                // Clear any cached Inertia pages
                if (window.history && window.history.state) {
                    // Force browser to not cache the previous page
                    window.history.replaceState(
                        { ...window.history.state, cache: false }, 
                        ''
                    );
                }
            }
        };
        
        if (isEditing) {
            put(route('blog-admin.update', post), options);
        } else {
            submitPost(route('blog-admin.store'), options);
        }
    };

    const handlePublishDateChange = (e) => {
        setData('published_at', e.target.value);
    };

    const handleImageSelect = (image) => {
        setData('featured_image', image.url);
        setImageSearchOpen(false);
    };

    const handleContentImageSelect = (image) => {
        if (editingImageUrl && editingImageIndex !== null) {
            // Replace specific image by index
            const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
            let imageCount = 0;
            let replacementMade = false;
            
            let newContent = data.content.replace(imagePattern, (match, alt, url) => {
                // Only process if we haven't made the replacement yet
                if (!replacementMade) {
                    if (imageCount === editingImageIndex) {
                        replacementMade = true;
                        return `![${image.alt}](${image.url})`;
                    }
                    imageCount++;
                }
                return match;
            });
            
            setData('content', newContent);
            setEditingImageUrl(null);
            setEditingImageIndex(null);
        } else {
            // Insert new image
            const markdownImage = `![${image.alt}](${image.url})`;
            insertMarkdown(markdownImage, '');
        }
        setContentImageSearchOpen(false);
    };

    const handlePreviewImageClick = (imageUrl, imageAlt, imageIndex) => {
        setEditingImageUrl(imageUrl);
        setEditingImageIndex(imageIndex);
        setContentImageSearchOpen(true);
    };

    const removeImage = (imageIndex) => {
        const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let imageCount = 0;
        let replacementMade = false;
        
        let newContent = data.content.replace(imagePattern, (match, alt, url) => {
            if (!replacementMade) {
                if (imageCount === imageIndex) {
                    replacementMade = true;
                    return ''; // Remove the image by replacing with empty string
                }
                imageCount++;
            }
            return match;
        });
        
        // Clean up any extra newlines that might be left
        newContent = newContent.replace(/\n\n\n+/g, '\n\n');
        
        setData('content', newContent);
        setEditingImageUrl(null);
        setEditingImageIndex(null);
        setContentImageSearchOpen(false);
    };

    const handleTextSelection = () => {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            if (selectedText && selectedText.length > 0) {
                setSelectedText(selectedText);
            } else {
                // Clear selected text if nothing is selected
                setSelectedText('');
            }
        }, 10);
    };

    const clearSelectedText = () => {
        setSelectedText('');
        window.getSelection().removeAllRanges();
    };

    // Only clear selection when clicking outside the preview and chat areas
    useEffect(() => {
        const handleDocumentClick = (e) => {
            // Check if the click was outside both the preview and chat areas
            const previewArea = e.target.closest('.preview-area');
            const chatArea = e.target.closest('.chat-area');
            
            if (!previewArea && !chatArea && selectedText) {
                // Only clear if there's no current text selection
                const selection = window.getSelection();
                if (!selection.toString().trim()) {
                    setSelectedText('');
                }
            }
        };

        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [selectedText]);


    const insertMarkdown = (before, after = '') => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = data.content.substring(start, end);
        const newText = data.content.substring(0, start) + before + selectedText + after + data.content.substring(end);
        
        setData('content', newText);
        
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length + after.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const markdownButtons = [
        { icon: 'fas fa-bold', title: 'Bold', action: () => insertMarkdown('**', '**') },
        { icon: 'fas fa-italic', title: 'Italic', action: () => insertMarkdown('*', '*') },
        { icon: 'fas fa-heading', title: 'Heading 2', label: 'H2', fontSize: 'text-base', action: () => insertMarkdown('## ', '') },
        { icon: 'fas fa-heading', title: 'Heading 3', label: 'H3', fontSize: 'text-sm', action: () => insertMarkdown('### ', '') },
        { icon: 'fas fa-link', title: 'Link', action: () => insertMarkdown('[', '](url)') },
        { icon: 'fas fa-quote-left', title: 'Quote', action: () => insertMarkdown('> ', '') },
        { icon: 'fas fa-list-ul', title: 'Bullet List', action: () => insertMarkdown('- ', '') },
        { icon: 'fas fa-list-ol', title: 'Numbered List', action: () => insertMarkdown('1. ', '') },
        { icon: 'fas fa-code', title: 'Inline Code', action: () => insertMarkdown('`', '`') },
        { icon: 'fas fa-file-code', title: 'Code Block', action: () => insertMarkdown('```\n', '\n```') },
        { icon: 'fas fa-image', title: 'Search & Insert Image', action: () => setContentImageSearchOpen(true) },
    ];



    return (
        <div className="flex gap-6 min-h-screen">
            {/* Form Column */}
            <div className="flex-1 max-w-3xl">
                <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollBehavior: 'auto' }}>
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={handleTitleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                        {errors.slug && <div className="text-red-600 text-sm mt-1">{errors.slug}</div>}
                    </div>

                    {/* Content - Hide when More Options is shown */}
                    {!showMoreOptions && (
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <div className="flex rounded-lg border border-gray-300 bg-gray-50 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setContentMode('chat')}
                                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                            contentMode === 'chat'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <i className="fas fa-comments mr-2"></i>
                                        AI Chat
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setContentMode('markdown')}
                                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                            contentMode === 'markdown'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <i className="fas fa-code mr-2"></i>
                                        Markdown
                                    </button>
                                </div>
                            </div>

                            {contentMode === 'chat' ? (
                                <div className="chat-area">
                                    <ChatInterface 
                                        content={data.content}
                                        onContentChange={(newContent) => setData('content', newContent)}
                                        title={data.title}
                                        selectedText={selectedText}
                                        onClearSelectedText={clearSelectedText}
                                    />
                                </div>
                            ) : (
                                <div className="border border-gray-300 rounded-md overflow-hidden">
                                    <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                                        {markdownButtons.map((button, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={button.action}
                                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                                title={button.title}
                                            >
                                                {button.label ? (
                                                    <span className="font-semibold">{button.label}</span>
                                                ) : (
                                                    <i className={button.icon}></i>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        ref={contentRef}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full p-3 font-mono text-sm border-0 focus:ring-0"
                                        rows={15}
                                        required
                                    />
                                </div>
                            )}
                            {errors.content && <div className="text-red-600 text-sm mt-1">{errors.content}</div>}
                        </div>
                    )}

                    {/* More Options Toggle */}
                    <div className="border-t pt-6">
                        <button
                            type="button"
                            onClick={() => setShowMoreOptions(!showMoreOptions)}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <span className="text-lg font-semibold text-gray-900">More Options</span>
                            <i className={`fas fa-chevron-${showMoreOptions ? 'up' : 'down'} text-gray-400`}></i>
                        </button>
                    </div>

                    {/* Collapsible Options */}
                    {showMoreOptions && (
                        <div className="space-y-6">
                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                                <textarea
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    rows={3}
                                />
                                {errors.excerpt && <div className="text-red-600 text-sm mt-1">{errors.excerpt}</div>}
                            </div>

                            {/* Featured Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Featured Image URL</label>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="url"
                                        value={data.featured_image}
                                        onChange={(e) => setData('featured_image', e.target.value)}
                                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImageSearchOpen(true)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition whitespace-nowrap"
                                    >
                                        <i className="fas fa-search mr-2"></i>
                                        Search Images
                                    </button>
                                </div>
                                {errors.featured_image && <div className="text-red-600 text-sm mt-1">{errors.featured_image}</div>}
                                {data.featured_image && (
                                    <div className="mt-3">
                                        <img
                                            src={data.featured_image}
                                            alt="Featured image preview"
                                            className="w-32 h-32 object-cover rounded-lg border"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Author Selection */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Author</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Select Author</label>
                                    <select
                                        value={data.author_id}
                                        onChange={(e) => setData('author_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Select an author...</option>
                                        {authors?.map((author) => (
                                            <option key={author.id} value={author.id}>
                                                {author.name} - {author.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.author_id && <div className="text-red-600 text-sm mt-1">{errors.author_id}</div>}
                                </div>
                            </div>

                            {/* Publishing Options */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Publishing Options</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                        {errors.status && <div className="text-red-600 text-sm mt-1">{errors.status}</div>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Publish Date</label>
                                        <input
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={handlePublishDateChange}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        />
                                        {errors.published_at && <div className="text-red-600 text-sm mt-1">{errors.published_at}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onCancel || (() => window.history.back())}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Blog Post' : 'Create Blog Post')}
                        </button>
                    </div>
                    </form>
                </div>
            </div>
            
            {/* Preview Column */}
            <div className="flex-1">
                <div className="bg-white rounded-lg shadow-lg">
                    {/* Header Section - full width background */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-100 rounded-t-lg py-12">
                        <div className="max-w-4xl mx-auto px-8">
                            <BlogHeader
                                title={data.title || 'Blog Post Title'}
                                subtitle=""
                                author={authors?.find(author => author.id == data.author_id) || { name: 'Author' }}
                                publishedAt={data.published_at}
                                featuredImage={data.featured_image}
                                showFeaturedImage={true}
                            />
                            
                            {data.status === 'draft' && (
                                <div className="text-center mt-4">
                                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        DRAFT
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Content Section - constrained width */}
                    <div className="p-8">
                        <div className="max-w-4xl mx-auto">
                            {data.content ? (
                                <div 
                                    className="preview-area"
                                    onMouseUp={handleTextSelection}
                                    onClick={handleTextSelection}
                                    onKeyUp={handleTextSelection}
                                >
                                    <MarkdownRenderer 
                                        content={data.content} 
                                        onImageClick={handlePreviewImageClick}
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center">Start typing to see preview...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Search Modal - Featured Image */}
            <ImageSearchModal
                isOpen={imageSearchOpen}
                onClose={() => setImageSearchOpen(false)}
                onSelectImage={handleImageSelect}
                title="Search Featured Images"
            />

            {/* Image Search Modal - Content Images */}
            <ImageSearchModal
                isOpen={contentImageSearchOpen}
                onClose={() => {
                    setContentImageSearchOpen(false);
                    setEditingImageUrl(null);
                    setEditingImageIndex(null);
                }}
                onSelectImage={handleContentImageSelect}
                onRemoveImage={editingImageUrl ? () => removeImage(editingImageIndex) : null}
                title={editingImageUrl ? "Replace Image" : "Search & Insert Image"}
            />
        </div>
    );
}