import * as React from "react";
import { motion, useDeprecatedInvertedScale } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, strikethrough, etc.)
import Image from 'next/image';

interface ProjectDetailsProps {
    description: string;
    links: {
        github?: string;
        live?: string;
    };
    modalImages: string[];
    onClose?: () => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = React.memo(({ description, links, modalImages, onClose }) => {
  const inverted = useDeprecatedInvertedScale();
  return (
    <motion.div
      className="content-container"
      style={{ ...inverted, originY: 0, originX: 0 }}
    >
        <div className="markdown-content">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                    // Custom styling for markdown elements
                    h1: ({node, ...props}) => <h1 className="markdown-h1" {...props} />,
                    h2: ({node, ...props}) => <h2 className="markdown-h2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="markdown-h3" {...props} />,
                    h4: ({node, ...props}) => <h4 className="markdown-h4" {...props} />,
                    p: ({node, ...props}) => <p className="markdown-p" {...props} />,
                    ul: ({node, ...props}) => <ul className="markdown-ul" {...props} />,
                    ol: ({node, ...props}) => <ol className="markdown-ol" {...props} />,
                    li: ({node, ...props}) => <li className="markdown-li" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="markdown-blockquote" {...props} />,
                    code: ({node, ...props}) => {
                        const isInline = !props.className?.includes('language-');
                        return isInline ? 
                            <code className="markdown-code-inline" {...props} /> : 
                            <code className="markdown-code-block" {...props} />;
                    },
                    pre: ({node, ...props}) => <pre className="markdown-pre" {...props} />,
                    a: ({node, ...props}) => <a className="markdown-link" target="_blank" rel="noopener noreferrer" {...props} />,
                    strong: ({node, ...props}) => <strong className="markdown-strong" {...props} />,
                    em: ({node, ...props}) => <em className="markdown-em" {...props} />,
                    table: ({node, ...props}) => <table className="markdown-table" {...props} />,
                    thead: ({node, ...props}) => <thead className="markdown-thead" {...props} />,
                    tbody: ({node, ...props}) => <tbody className="markdown-tbody" {...props} />,
                    tr: ({node, ...props}) => <tr className="markdown-tr" {...props} />,
                    th: ({node, ...props}) => <th className="markdown-th" {...props} />,
                    td: ({node, ...props}) => <td className="markdown-td" {...props} />,
                }}
            >
                {description}
            </ReactMarkdown>
        </div>
        
        <div className="links-container">
            {links.github && (
                <a href={links.github} target="_blank" rel="noopener noreferrer" className="project-link github-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                </a>
            )}
            {links.live && (
                <a href={links.live} target="_blank" rel="noopener noreferrer" className="project-link live-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/>
                    </svg>
                    Live Demo
                </a>
            )}
        </div>
        <div className="modal-images-container">
            {modalImages.map((src, index) => (
                <Image key={index} src={src} alt={`Project screenshot ${index + 1}`} className="modal-image" width={800} height={600} />
            ))}
        </div>
    </motion.div>
  );
});

ProjectDetails.displayName = "ProjectDetails";