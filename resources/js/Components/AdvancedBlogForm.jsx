import { useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import ImageSearchModal from '@/Components/Blog/ImageSearchModal';
import MarkdownRenderer from '@/Components/Blog/MarkdownRenderer';
import BlogHeader from '@/Components/Blog/BlogHeader';

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
        
        if (isEditing) {
            put(route('blog-admin.update', post));
        } else {
            submitPost(route('blog-admin.store'));
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
        if (editingImageUrl) {
            // Replace existing image
            const oldImageRegex = new RegExp(`!\\[([^\\]]*)\\]\\(${editingImageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
            const newMarkdown = `![${image.alt}](${image.url})`;
            setData('content', data.content.replace(oldImageRegex, newMarkdown));
            setEditingImageUrl(null);
        } else {
            // Insert new image
            const markdownImage = `![${image.alt}](${image.url})`;
            insertMarkdown(markdownImage, '');
        }
        setContentImageSearchOpen(false);
    };

    const handlePreviewImageClick = (imageUrl) => {
        setEditingImageUrl(imageUrl);
        setContentImageSearchOpen(true);
    };

    const handlePreviewParagraphClick = (paragraphIndex) => {
        const textarea = contentRef.current;
        if (!textarea || !data.content) return;

        // Split content the same way as in renderMarkdown to find the paragraph
        const paragraphs = data.content.split('\n\n');
        
        if (paragraphIndex >= paragraphs.length) return;

        // Find the start and end positions of the target paragraph in the source
        let startPos = 0;
        for (let i = 0; i < paragraphIndex; i++) {
            startPos += paragraphs[i].length + 2; // +2 for '\n\n'
        }
        
        const targetParagraph = paragraphs[paragraphIndex];
        const endPos = startPos + targetParagraph.length;

        // Select the paragraph in the textarea
        textarea.focus();
        textarea.setSelectionRange(startPos, endPos);
        
        // Scroll to make the selection visible
        textarea.scrollTop = textarea.scrollHeight * (startPos / data.content.length) - textarea.clientHeight / 2;
    };

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

    const renderMarkdown = (text) => {
        if (!text) return '';
        
        let html = text
            // Headers
            .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.5rem; font-weight: 600; color: #1f2937; margin: 2.5rem 0 1rem 0; line-height: 1.4;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 style="font-size: 2rem; font-weight: 700; color: #1f2937; margin: 3rem 0 1.5rem 0; line-height: 1.3;">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 style="font-size: 2.5rem; font-weight: 700; color: #1f2937; margin: 2rem 0 1.5rem 0; line-height: 1.2;">$1</h1>')
            // Bold and italic
            .replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 600; color: #1f2937;">$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em style="font-style: italic;">$1</em>')
            // Images (must come before links since ![alt](url) contains [alt](url))
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" data-image-url="$2" class="clickable-preview-image" style="width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); margin: 1.5rem auto; display: block; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform=\'scale(1.02)\'; this.style.boxShadow=\'0 15px 30px -5px rgba(0, 0, 0, 0.15), 0 8px 12px -2px rgba(0, 0, 0, 0.1)\';" onmouseout="this.style.transform=\'scale(1)\'; this.style.boxShadow=\'0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)\';" />')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 2px;">$1</a>')
            // Code blocks
            .replace(/```([^`]*)```/g, '<pre style="background-color: #1e293b; color: #e2e8f0; padding: 1.5rem; border-radius: 0.75rem; overflow-x: auto; margin: 2rem 0; font-family: ui-monospace, SFMono-Regular, \'SF Mono\', Consolas, \'Liberation Mono\', Menlo, monospace;"><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code style="background-color: #f1f5f9; color: #1e293b; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-family: ui-monospace, SFMono-Regular, \'SF Mono\', Consolas, \'Liberation Mono\', Menlo, monospace; font-size: 0.875rem;">$1</code>')
            // Blockquotes
            .replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #3b82f6; padding: 1rem 0 1rem 2rem; margin: 2rem 0; font-style: italic; color: #6b7280; background-color: #f8fafc; border-radius: 0 0.5rem 0.5rem 0;">$1</blockquote>')
            .split('\n')
            .map(line => {
                if (line.trim().startsWith('- ')) {
                    return `<li style="margin-bottom: 0.75rem; color: #374151; line-height: 1.6;">${line.substring(2)}</li>`;
                } else if (line.trim().match(/^\d+\. /)) {
                    return `<li style="margin-bottom: 0.75rem; color: #374151; line-height: 1.6;">${line.replace(/^\d+\. /, '')}</li>`;
                }
                return line;
            })
            .join('\n')
            .replace(/(<li style="[^"]*">.*<\/li>\n?)+/g, match => {
                if (match.includes('- ')) {
                    return `<ul style="margin: 1.5rem 0; padding-left: 2rem;">${match}</ul>`;
                }
                return `<ol style="margin: 1.5rem 0; padding-left: 2rem;">${match}</ol>`;
            })
            .split('\n\n')
            .map((para, index) => {
                if (!para.trim()) return '';
                if (para.includes('<h1') || para.includes('<h2') || para.includes('<h3') || 
                    para.includes('<ul') || para.includes('<ol') || para.includes('<blockquote') ||
                    para.includes('<pre') || para.includes('<img')) {
                    return para;
                }
                return `<p data-paragraph-index="${index}" class="clickable-preview-paragraph" style="font-size: 1.125rem; line-height: 1.75; color: #374151; margin-bottom: 0.5rem; cursor: pointer; padding: 0.5rem; margin-left: -0.5rem; margin-right: -0.5rem; border-radius: 0.375rem; transition: background-color 0.2s ease;" onmouseover="this.style.backgroundColor='#f8fafc';" onmouseout="this.style.backgroundColor='transparent';">${para}</p>`;
            })
            .join('\n');
            
        return html;
    };

    // Handle clicks on preview images and paragraphs
    useEffect(() => {
        const handlePreviewClick = (e) => {
            // Handle image clicks
            if (e.target.classList.contains('clickable-preview-image')) {
                e.preventDefault();
                const imageUrl = e.target.getAttribute('data-image-url');
                if (imageUrl) {
                    handlePreviewImageClick(imageUrl);
                }
                return;
            }
            
            // Handle paragraph clicks
            if (e.target.classList.contains('clickable-preview-paragraph')) {
                e.preventDefault();
                const paragraphIndex = parseInt(e.target.getAttribute('data-paragraph-index'));
                if (!isNaN(paragraphIndex)) {
                    handlePreviewParagraphClick(paragraphIndex);
                }
                return;
            }
        };

        // Add event listener to document to catch dynamically rendered elements
        document.addEventListener('click', handlePreviewClick);

        return () => {
            document.removeEventListener('click', handlePreviewClick);
        };
    }, [data.content]);

    return (
        <div className="flex gap-6">
            {/* Form Column */}
            <div className="flex-1">
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

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content (Markdown supported)</label>
                        <div className="mt-1 border border-gray-300 rounded-md overflow-hidden">
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
                        {errors.content && <div className="text-red-600 text-sm mt-1">{errors.content}</div>}
                    </div>

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
            
            {/* Preview Column */}
            <div className="flex-1">
                <div className="bg-white rounded-lg shadow-lg p-8 sticky top-8">
                    <BlogHeader
                        title={data.title || 'Blog Post Title'}
                        subtitle=""
                        author={authors?.find(author => author.id == data.author_id) || { name: 'Author' }}
                        publishedAt={data.published_at}
                        featuredImage={data.featured_image}
                        showFeaturedImage={true}
                    />
                    
                    {data.status === 'draft' && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-6">
                            DRAFT
                        </span>
                    )}
                    
                    {data.content ? (
                        <MarkdownRenderer content={data.content} />
                    ) : (
                        <p className="text-gray-400">Start typing to see preview...</p>
                    )}
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
                }}
                onSelectImage={handleContentImageSelect}
                title={editingImageUrl ? "Replace Image" : "Search & Insert Image"}
            />
        </div>
    );
}