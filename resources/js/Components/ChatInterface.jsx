import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DiffModal from './DiffModal';

export default function ChatInterface({ content, onContentChange, title = '', selectedText = '', onClearSelectedText }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [pendingChange, setPendingChange] = useState(null); // Store pending changes for diff modal

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };

    useEffect(() => {
        // Only scroll to bottom if there are messages and the chat is visible
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const quickPrompts = [
        "Make the introduction more engaging",
        "Add a code example",
        "Improve the conclusion",
        "Add more technical details",
        "Make it more beginner-friendly",
        "Add a troubleshooting section"
    ];

    const handleSendMessage = async (message = inputMessage) => {
        if (!message.trim()) return;

        // Construct the full message with context if selected text exists
        let fullMessage = message;
        if (selectedText) {
            fullMessage = `Regarding this section: "${selectedText}"\n\n${message}`;
            console.log('Sending message with context:', fullMessage);
        }

        const userMessage = { 
            role: 'user', 
            content: fullMessage, // Store the full message with context for chat history
            displayContent: message, // Store original message for display
            timestamp: new Date(),
            hasContext: !!selectedText,
            contextText: selectedText || null
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        // Clear selected text after sending
        if (selectedText && onClearSelectedText) {
            onClearSelectedText();
        }

        try {
            // Call the modify-content endpoint (now handles both chat and modifications)
            const response = await axios.post(route('blog-admin.modify-content'), {
                content: content,
                user_request: fullMessage,
                title: title,
                chat_history: messages
            });

            if (response.data.success) {
                const { content: newContent, message: aiMessage, isModification } = response.data;
                
                if (isModification && newContent && newContent.trim() !== content.trim()) {
                    // This is a content modification - show diff modal
                    setPendingChange({
                        originalContent: content,
                        newContent: newContent,
                        explanation: aiMessage || "I've updated the content based on your request.",
                        userMessage: message
                    });
                } else {
                    // This is just a conversation response
                    const chatMessage = { 
                        role: 'assistant', 
                        content: aiMessage || "I understand your request.",
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, chatMessage]);
                }
            } else {
                throw new Error(response.data.error || 'Failed to communicate with AI');
            }
        } catch (error) {
            console.error('Error modifying content:', error);
            
            let errorMessage = "Sorry, I encountered an error. Please try again.";
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            const aiErrorMessage = { 
                role: 'assistant', 
                content: errorMessage,
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, aiErrorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleQuickPrompt = (prompt) => {
        handleSendMessage(prompt);
    };

    const handleApproveChanges = () => {
        if (pendingChange) {
            // Apply the changes
            onContentChange(pendingChange.newContent);
            
            // Add success message to chat
            const aiMessage = { 
                role: 'assistant', 
                content: `✅ Changes applied! ${pendingChange.explanation}`,
                timestamp: new Date(),
                isSuccess: true
            };
            setMessages(prev => [...prev, aiMessage]);
            
            // Clear pending change
            setPendingChange(null);
        }
    };

    const handleRejectChanges = () => {
        if (pendingChange) {
            // Add rejection message to chat
            const aiMessage = { 
                role: 'assistant', 
                content: "❌ Changes rejected. The original content has been preserved.",
                timestamp: new Date(),
                isWarning: true
            };
            setMessages(prev => [...prev, aiMessage]);
            
            // Clear pending change
            setPendingChange(null);
        }
    };

    return (
        <div className="flex flex-col h-[36rem] border border-gray-300 rounded-md bg-white">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
                {messages.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="mb-4">
                                <i className="fas fa-comments text-3xl text-gray-300"></i>
                            </div>
                            <p className="text-sm font-medium">Chat with AI to modify your content</p>
                            <p className="text-xs text-gray-400 mt-2">
                                Try: "Make the introduction more engaging" or "Add a code example"
                            </p>
                        </div>
                    </div>
                )}
                
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                                message.role === 'user'
                                    ? 'bg-indigo-600 text-white'
                                    : message.isError
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : message.isWarning
                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                    : message.isSuccess
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                            }`}
                        >
                            {message.hasContext && (
                                <div className="mb-2 pb-2 border-b border-indigo-400/30">
                                    <p className="text-xs text-indigo-200 font-medium mb-1">
                                        <i className="fas fa-quote-left mr-1"></i>
                                        Regarding selected text:
                                    </p>
                                    <p className="text-xs text-indigo-100 italic">
                                        "{message.contextText?.length > 60 ? message.contextText.substring(0, 60) + '...' : message.contextText}"
                                    </p>
                                </div>
                            )}
                            <p className="text-sm leading-relaxed">{message.displayContent || message.content}</p>
                            <p className={`text-xs mt-2 flex items-center gap-1 ${
                                message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                            }`}>
                                {message.hasContext && (
                                    <i className="fas fa-link text-xs" title="Message included selected text"></i>
                                )}
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 border border-gray-200 shadow-sm px-4 py-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-sm text-gray-600">AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 0 && (
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Quick prompts:</p>
                    <div className="flex flex-wrap gap-1">
                        {quickPrompts.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickPrompt(prompt)}
                                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 rounded-full transition-colors border border-gray-200 hover:border-indigo-200"
                                disabled={isLoading}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                {/* Selected Text Context */}
                {selectedText && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-xs font-medium text-blue-700 mb-1">Selected Context:</p>
                                <p className="text-sm text-blue-800 italic">
                                    "{selectedText.length > 85 ? selectedText.substring(0, 85) + '...' : selectedText}"
                                </p>
                            </div>
                            <button
                                onClick={onClearSelectedText}
                                className="ml-2 text-blue-400 hover:text-blue-600 transition-colors"
                                title="Clear selection"
                            >
                                <i className="fas fa-times text-xs"></i>
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="flex space-x-3">
                    <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Describe what you'd like to change..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={2}
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim() || isLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[3rem]"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <i className="fas fa-paper-plane"></i>
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                    {selectedText && <span className="ml-2 text-blue-600">• Context will be included</span>}
                </p>
            </div>

            {/* Diff Modal */}
            {pendingChange && (
                <DiffModal
                    isOpen={!!pendingChange}
                    onClose={handleRejectChanges}
                    originalContent={pendingChange.originalContent}
                    newContent={pendingChange.newContent}
                    explanation={pendingChange.explanation}
                    onApprove={handleApproveChanges}
                    onReject={handleRejectChanges}
                />
            )}
        </div>
    );
}