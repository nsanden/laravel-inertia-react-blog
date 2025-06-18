import { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AiChatPanel from './AiChatPanel';
import AiPreviewPanel from './AiPreviewPanel';
import useAiArticle from '../../hooks/useAiArticle';

export default function AiArticleBuilder({ post = null, authors = [], onCancel }) {
    const isEditing = !!post;
    const [chatMessages, setChatMessages] = useState([]);
    const [currentArticle, setCurrentArticle] = useState(post?.content || '');
    const [isGenerating, setIsGenerating] = useState(false);
    
    const { data, setData, post: submitPost, put, processing, errors } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        content: post?.content || '',
        excerpt: post?.excerpt || '',
        featured_image: post?.featured_image || '',
        author_id: post?.author_id || (authors.length > 0 ? authors[0].id : ''),
        status: post?.status || 'draft',
        published_at: post?.published_at || new Date().toISOString().slice(0, 16),
    });

    const { generateArticle, updateArticle } = useAiArticle();

    const handleInitialGeneration = async (prompt) => {
        setIsGenerating(true);
        try {
            const result = await generateArticle(prompt);
            setCurrentArticle(result.content);
            setData('content', result.content);
            if (result.title) setData('title', result.title);
            if (result.excerpt) setData('excerpt', result.excerpt);
            
            setChatMessages([
                { role: 'user', content: prompt },
                { role: 'assistant', content: 'I\'ve created your article! You can see it in the preview. Feel free to ask me to modify any part of it.' }
            ]);
        } catch (error) {
            console.error('Article generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleArticleUpdate = async (userRequest) => {
        setIsGenerating(true);
        try {
            const result = await updateArticle(currentArticle, userRequest, chatMessages);
            setCurrentArticle(result.content);
            setData('content', result.content);
            
            setChatMessages(prev => [
                ...prev,
                { role: 'user', content: userRequest },
                { role: 'assistant', content: result.explanation || 'Updated! Check the preview to see the changes.' }
            ]);
        } catch (error) {
            console.error('Article update failed:', error);
            setChatMessages(prev => [
                ...prev,
                { role: 'user', content: userRequest },
                { role: 'assistant', content: 'Sorry, I encountered an error updating the article. Please try again.' }
            ]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleImageReplace = async (imageAlt, newDescription) => {
        const request = `Replace the image with alt text "${imageAlt}" with a new image: ${newDescription}`;
        await handleArticleUpdate(request);
    };

    const handleSectionEdit = async (sectionText, instruction) => {
        const request = `For the section that contains "${sectionText.substring(0, 50)}...", ${instruction}`;
        await handleArticleUpdate(request);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            put(route('blog-admin.update', post));
        } else {
            submitPost(route('blog-admin.store'));
        }
    };

    return (
        <div className="flex gap-6 h-screen">
            {/* Chat Panel */}
            <div className="w-1/2">
                <AiChatPanel
                    messages={chatMessages}
                    onInitialGeneration={handleInitialGeneration}
                    onArticleUpdate={handleArticleUpdate}
                    isGenerating={isGenerating}
                    hasArticle={!!currentArticle}
                />
            </div>

            {/* Preview Panel */}
            <div className="w-1/2">
                <AiPreviewPanel
                    article={currentArticle}
                    title={data.title}
                    authors={authors}
                    selectedAuthorId={data.author_id}
                    publishedAt={data.published_at}
                    status={data.status}
                    featuredImage={data.featured_image}
                    onImageReplace={handleImageReplace}
                    onSectionEdit={handleSectionEdit}
                    onSave={handleSubmit}
                    onCancel={onCancel}
                    isProcessing={processing}
                    isEditing={isEditing}
                />
            </div>
        </div>
    );
}