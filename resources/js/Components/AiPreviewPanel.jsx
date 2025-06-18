import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import BlogHeader from './BlogHeader';

export default function AiPreviewPanel({
    article,
    title,
    authors,
    selectedAuthorId,
    publishedAt,
    status,
    featuredImage,
    onImageReplace,
    onSectionEdit,
    onSave,
    onCancel,
    isProcessing,
    isEditing
}) {
    const [hoveredSection, setHoveredSection] = useState(null);
    const [imageReplaceModal, setImageReplaceModal] = useState(null);
    const [sectionEditModal, setSectionEditModal] = useState(null);

    const selectedAuthor = authors?.find(author => author.id == selectedAuthorId);

    const parseArticleIntoSections = (content) => {
        if (!content) return [];
        
        const lines = content.split('\n');
        const sections = [];
        let currentSection = { type: 'content', lines: [], startLine: 0 };
        
        lines.forEach((line, index) => {
            if (line.startsWith('#')) {
                if (currentSection.lines.length > 0) {
                    sections.push(currentSection);
                }
                currentSection = { type: 'heading', lines: [line], startLine: index };
            } else if (line.startsWith('![')) {
                if (currentSection.lines.length > 0) {
                    sections.push(currentSection);
                }
                sections.push({ type: 'image', lines: [line], startLine: index });
                currentSection = { type: 'content', lines: [], startLine: index + 1 };
            } else {
                currentSection.lines.push(line);
            }
        });
        
        if (currentSection.lines.length > 0) {
            sections.push(currentSection);
        }
        
        return sections;
    };

    const extractImageInfo = (imageLine) => {
        const match = imageLine.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        return match ? { alt: match[1], url: match[2] } : null;
    };

    const sections = parseArticleIntoSections(article);

    const handleImageClick = (imageLine) => {
        const imageInfo = extractImageInfo(imageLine);
        if (imageInfo) {
            setImageReplaceModal(imageInfo);
        }
    };

    const handleSectionHover = (sectionIndex, isHovering) => {
        setHoveredSection(isHovering ? sectionIndex : null);
    };

    const handleSectionEdit = (section) => {
        setSectionEditModal({
            text: section.lines.join('\n'),
            type: section.type
        });
    };

    const handleImageReplace = (newDescription) => {
        if (imageReplaceModal) {
            onImageReplace(imageReplaceModal.alt, newDescription);
            setImageReplaceModal(null);
        }
    };

    const handleSectionUpdate = (instruction) => {
        if (sectionEditModal) {
            onSectionEdit(sectionEditModal.text, instruction);
            setSectionEditModal(null);
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Live Preview</h2>
                        <p className="text-gray-600">Click elements to edit</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            disabled={isProcessing}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isProcessing ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Post' : 'Create Post')}
                        </button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {article ? (
                        <div className="max-w-4xl mx-auto">
                            {/* Blog Header */}
                            <BlogHeader
                                title={title || 'Your Article Title'}
                                author={selectedAuthor || { name: 'Author' }}
                                publishedAt={publishedAt}
                                featuredImage={featuredImage}
                                showFeaturedImage={true}
                            />
                            
                            {status === 'draft' && (
                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-6">
                                    DRAFT
                                </span>
                            )}

                            {/* Interactive Article Content */}
                            <div className="space-y-4">
                                {sections.map((section, index) => (
                                    <div
                                        key={index}
                                        className={`relative group ${
                                            hoveredSection === index ? 'ring-2 ring-indigo-300 ring-opacity-50 rounded-lg' : ''
                                        }`}
                                        onMouseEnter={() => handleSectionHover(index, true)}
                                        onMouseLeave={() => handleSectionHover(index, false)}
                                    >
                                        {section.type === 'image' ? (
                                            <div 
                                                className="cursor-pointer"
                                                onClick={() => handleImageClick(section.lines[0])}
                                            >
                                                <MarkdownRenderer content={section.lines[0]} />
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="bg-white shadow-lg rounded-lg px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                        <i className="fas fa-edit mr-1"></i>
                                                        Replace Image
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="cursor-pointer" onClick={() => handleSectionEdit(section)}>
                                                <MarkdownRenderer content={section.lines.join('\n')} />
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="bg-white shadow-lg rounded-lg px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                        <i className="fas fa-edit mr-1"></i>
                                                        Edit Section
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!article && (
                                <div className="text-center text-gray-500 py-12">
                                    <i className="fas fa-file-alt text-4xl mb-4"></i>
                                    <p>Your article will appear here once generated</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <i className="fas fa-magic text-4xl mb-4"></i>
                                <p className="text-lg">Start chatting to create your article!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Replace Modal */}
            {imageReplaceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium mb-4">Replace Image</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Current image: "{imageReplaceModal.alt}"
                        </p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const description = e.target.description.value;
                            if (description) handleImageReplace(description);
                        }}>
                            <input
                                name="description"
                                type="text"
                                placeholder="Describe the new image you want..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent mb-4"
                                autoFocus
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setImageReplaceModal(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                                >
                                    Replace Image
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Section Edit Modal */}
            {sectionEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium mb-4">Edit Section</h3>
                        <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
                            {sectionEditModal.text.substring(0, 200)}...
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const instruction = e.target.instruction.value;
                            if (instruction) handleSectionUpdate(instruction);
                        }}>
                            <input
                                name="instruction"
                                type="text"
                                placeholder="How should I modify this section?"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent mb-4"
                                autoFocus
                            />
                            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                <button
                                    type="button"
                                    onClick={() => document.querySelector('input[name="instruction"]').value = "Make this more detailed"}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Make more detailed
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.querySelector('input[name="instruction"]').value = "Make this shorter"}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Make shorter
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.querySelector('input[name="instruction"]').value = "Add an example"}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Add example
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.querySelector('input[name="instruction"]').value = "Rewrite this"}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Rewrite
                                </button>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setSectionEditModal(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                                >
                                    Update Section
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}