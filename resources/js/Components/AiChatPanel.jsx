import { useState, useRef, useEffect } from 'react';

export default function AiChatPanel({ 
    messages, 
    onInitialGeneration, 
    onArticleUpdate, 
    isGenerating, 
    hasArticle 
}) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isGenerating) return;

        if (!hasArticle) {
            onInitialGeneration(input);
        } else {
            onArticleUpdate(input);
        }
        
        setInput('');
    };

    const quickPrompts = hasArticle ? [
        "Make the introduction more engaging",
        "Add a code example",
        "Include relevant images",
        "Add a conclusion section",
        "Make it more beginner-friendly",
        "Add a troubleshooting section"
    ] : [
        "Article about Docker for beginners",
        "How to set up a React development environment",
        "Complete guide to Laravel authentication",
        "Understanding JavaScript closures with examples",
        "Building a REST API with Node.js",
        "CSS Grid vs Flexbox comparison"
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                    {hasArticle ? 'Chat with Your Article' : 'AI Article Builder'}
                </h2>
                <p className="text-gray-600 mt-1">
                    {hasArticle 
                        ? 'Ask me to modify, expand, or improve your article'
                        : 'Describe the article you want to create'
                    }
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        <div className="mb-4">
                            <i className="fas fa-robot text-4xl text-indigo-600"></i>
                        </div>
                        <p className="text-lg font-medium mb-2">
                            {hasArticle ? 'Your article is ready!' : 'Ready to create your article?'}
                        </p>
                        <p>
                            {hasArticle 
                                ? 'Ask me to make changes, add sections, or improve the content.'
                                : 'Just describe what you want to write about and I\'ll create a complete article for you.'
                            }
                        </p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user' 
                                ? 'bg-indigo-600 text-white ml-4'
                                : 'bg-gray-100 text-gray-900 mr-4'
                        }`}>
                            <div className="flex items-start gap-2">
                                {message.role === 'assistant' && (
                                    <i className="fas fa-robot text-indigo-600 mt-1 flex-shrink-0"></i>
                                )}
                                <p className="text-sm">{message.content}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {isGenerating && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 mr-4">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-robot text-indigo-600"></i>
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span className="text-sm">Working on it...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 0 && (
                <div className="px-6 py-4 border-t bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-3">Quick start:</p>
                    <div className="grid grid-cols-1 gap-2">
                        {quickPrompts.slice(0, 3).map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => setInput(prompt)}
                                className="text-left text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                "{prompt}"
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-6 border-t">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={hasArticle 
                            ? "Ask me to modify the article..." 
                            : "Describe the article you want to create..."
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        disabled={isGenerating}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isGenerating}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isGenerating ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-paper-plane"></i>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}