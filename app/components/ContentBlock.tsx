'use client';

import { useState, useEffect } from 'react';
import { getContentByKey } from '@/app/lib/data';

interface ContentItem {
  id: number;
  key: string;
  section: string;
  title?: string;
  text?: string;
  image_url?: string;
}

interface ContentBlockProps {
  contentKey: string;
  fallbackTitle?: string;
  fallbackText?: string;
  fallbackImage?: string;
  className?: string;
  imageClassName?: string;
  titleClassName?: string;
  textClassName?: string;
}

export default function ContentBlock({
  contentKey,
  fallbackTitle = '',
  fallbackText = '',
  fallbackImage = '',
  className = '',
  imageClassName = '',
  titleClassName = '',
  textClassName = '',
}: ContentBlockProps) {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getContentByKey(contentKey);
        setContent(data);
      } catch (err) {
        console.error(`Error loading content for key ${contentKey}:`, err);
        setError(`Failed to load content for ${contentKey}`);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [contentKey]);

  const title = content?.title || fallbackTitle;
  const text = content?.text || fallbackText;
  const imageUrl = content?.image_url || fallbackImage;

  if (loading) {
    return <div className={`animate-pulse ${className}`}>Loading content...</div>;
  }

  if (error) {
    console.error(error);
    // On error, use fallback content
  }

  return (
    <div className={className}>
      {imageUrl && (
        <div className={imageClassName}>
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      
      {title && (
        <h2 className={titleClassName}>{title}</h2>
      )}
      
      {text && (
        <div className={textClassName}>
          {text.split('\n').map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-4' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
} 