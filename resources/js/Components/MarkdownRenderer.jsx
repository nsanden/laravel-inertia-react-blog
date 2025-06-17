import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content, className = "" }) {
    return (
        <div className={`prose prose-lg max-w-none 
            prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-5xl prose-h1:font-black prose-h1:leading-tight prose-h1:mt-12 prose-h1:mb-8
            prose-h2:text-4xl prose-h2:font-extrabold prose-h2:leading-tight prose-h2:mt-12 prose-h2:mb-8
            prose-h3:text-3xl prose-h3:font-bold prose-h3:leading-tight prose-h3:mt-12 prose-h3:mb-6
            prose-p:text-xl prose-p:leading-relaxed prose-p:text-gray-700 prose-p:mb-8
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-em:text-gray-700
            prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:font-mono
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-6 prose-pre:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-gray-700
            prose-ul:my-8 prose-ul:text-xl prose-ul:leading-relaxed prose-ul:text-gray-700
            prose-ol:my-8 prose-ol:text-xl prose-ol:leading-relaxed prose-ol:text-gray-700
            prose-li:mb-3 prose-li:text-xl prose-li:leading-relaxed
            prose-img:rounded-xl prose-img:shadow-xl prose-img:my-6 ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    img: ({node, ...props}) => (
                        <img
                            className="w-full h-auto rounded-xl shadow-xl my-6"
                            {...props}
                        />
                    ),
                    code: ({node, inline, className, children, ...props}) => {
                        if (inline) {
                            return (
                                <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-base font-mono" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <pre className="bg-gray-900 text-gray-100 rounded-lg p-6 my-8 overflow-x-auto">
                                <code className="font-mono text-sm" {...props}>
                                    {children}
                                </code>
                            </pre>
                        );
                    }
                }}
            >
                {content || ''}
            </ReactMarkdown>
        </div>
    );
}