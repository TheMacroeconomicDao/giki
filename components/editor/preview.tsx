"use client"

import type { CSSProperties } from "react"
import { useEditorContext } from "./editor-context"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import remarkToc from "remark-toc"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, github } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"
import Image from "next/image"

interface PreviewProps {
  style?: CSSProperties
}

export default function Preview({ style }: PreviewProps) {
  const { value } = useEditorContext()
  const { theme } = useTheme()

  return (
    <div className="prose dark:prose-invert max-w-none px-4 py-6 overflow-auto" style={style}>
      {value ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, [remarkToc, { heading: "table of contents" }]]}
          rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              return !inline && match ? (
                <SyntaxHighlighter
                  style={theme === "dark" ? vscDarkPlus : github}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            img({ src, alt, width, height }) {
              if (src && alt) {
                return (
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={alt}
                    width={width ? Number.parseInt(width.toString()) : 500}
                    height={height ? Number.parseInt(height.toString()) : 300}
                    className="rounded-md mx-auto"
                  />
                )
              }
              return null
            },
          }}
        >
          {value}
        </ReactMarkdown>
      ) : (
        <p className="text-muted-foreground italic">Nothing to preview</p>
      )}
    </div>
  )
}
