import { useState, useEffect } from 'react';

export default function ImageSearchModal({ isOpen, onClose, onSelectImage, onRemoveImage = null, title = "Search Images" }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);

    const UNSPLASH_ACCESS_KEY = 'HOG7mUjP5G7m58OR_llCgTK_NunQTZh3DFh-WLR_0mA';
    const IMAGES_PER_PAGE = 12;

    const searchImages = async (query, page = 1) => {
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${IMAGES_PER_PAGE}&page=${page}&order_by=relevant`,
                {
                    headers: {
                        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }

            const data = await response.json();
            setImages(data.results || []);
            setTotalPages(Math.ceil(data.total / IMAGES_PER_PAGE));
            setCurrentPage(page);
        } catch (err) {
            setError('Failed to search images. Please try again.');
            console.error('Image search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            searchImages(searchQuery, 1);
        }
    };

    // Debounced search effect
    useEffect(() => {
        // Clear existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // If there's a search query, set up new timeout
        if (searchQuery.trim()) {
            const timeout = setTimeout(() => {
                searchImages(searchQuery, 1);
            }, 500);
            setSearchTimeout(timeout);
        } else {
            // Clear results if search query is empty
            setImages([]);
            setHasSearched(false);
            setCurrentPage(1);
            setTotalPages(0);
        }

        // Cleanup timeout on unmount or dependency change
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchQuery]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !loading) {
            searchImages(searchQuery, newPage);
        }
    };

    const handleImageSelect = (image) => {
        onSelectImage({
            url: image.urls.regular,
            alt: image.alt_description || image.description || 'Unsplash image',
            thumbnail: image.urls.thumb,
            attribution: `Photo by ${image.user.name} on Unsplash`,
            downloadUrl: image.links.download_location
        });
        onClose();
    };

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setImages([]);
            setCurrentPage(1);
            setTotalPages(0);
            setError('');
            setHasSearched(false);
        } else {
            // Clear timeout when modal closes
            if (searchTimeout) {
                clearTimeout(searchTimeout);
                setSearchTimeout(null);
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        {onRemoveImage && (
                            <button
                                onClick={() => {
                                    onRemoveImage();
                                    onClose();
                                }}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                            >
                                <i className="fas fa-trash mr-2"></i>
                                Remove Image
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Start typing to search... (e.g., business, technology, people)"
                                className="w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoFocus
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <i className="fas fa-search text-gray-400"></i>
                                )}
                            </div>
                        </div>
                    </form>
                    <p className="text-xs text-gray-500 mt-2">
                        Images provided by Unsplash. Auto-searches as you type. Free to use under the Unsplash License.
                    </p>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-3 text-gray-600">Searching images...</span>
                        </div>
                    )}

                    {!loading && images.length === 0 && hasSearched && !error && (
                        <div className="text-center py-12 text-gray-500">
                            <i className="fas fa-search text-4xl mb-4"></i>
                            <p>No images found for "{searchQuery}". Try different keywords.</p>
                        </div>
                    )}

                    {!loading && images.length === 0 && !hasSearched && !error && (
                        <div className="text-center py-12 text-gray-500">
                            <i className="fas fa-images text-4xl mb-4"></i>
                            <p>Search for images to get started.</p>
                        </div>
                    )}

                    {!loading && images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all group"
                                    onClick={() => handleImageSelect(image)}
                                >
                                    <div className="aspect-square relative">
                                        <img
                                            src={image.urls.small}
                                            alt={image.alt_description || 'Unsplash image'}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                            <i className="fas fa-check-circle text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-xs text-gray-600 truncate">
                                            {image.alt_description || image.description || 'Untitled'}
                                        </p>
                                        <p className="text-xs text-gray-400">by {image.user.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            
                            {/* Show page numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 text-sm rounded ${
                                            pageNum === currentPage
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } transition-colors`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}