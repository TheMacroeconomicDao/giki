'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/shared/lib/utils';

interface PageContentProps {
  content: string;
  className?: string;
  contentFormat?: 'markdown' | 'plain';
}

export const PageContent: React.FC<PageContentProps> = ({
  content,
  className,
  contentFormat = 'markdown',
}) => {
  // Компоненты для оформления markdown
  const components = useMemo(() => ({
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          language={match[1]}
          style={atomDark}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={cn('bg-muted px-1.5 py-0.5 rounded text-sm', className)} {...props}>
          {children}
        </code>
      );
    },
    a: ({ node, ...props }: any) => (
      <a 
        className="text-primary underline underline-offset-4 hover:text-primary/80" 
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      />
    ),
    h1: ({ node, ...props }: any) => (
      <h1 className="text-3xl font-bold mt-6 mb-4 border-b pb-2" {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc pl-6 my-4" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal pl-6 my-4" {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4" {...props} />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse" {...props} />
      </div>
    ),
    tr: ({ node, ...props }: any) => (
      <tr className="border-b border-border even:bg-muted/30" {...props} />
    ),
    th: ({ node, ...props }: any) => (
      <th className="text-left py-2 px-3 font-medium" {...props} />
    ),
    td: ({ node, ...props }: any) => (
      <td className="py-2 px-3" {...props} />
    ),
  }), []);
  
  if (contentFormat === 'plain') {
    return (
      <div className={cn("prose prose-sm max-w-none dark:prose-invert", className)}>
        {content.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert", className)}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}; 