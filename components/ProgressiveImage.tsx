import React, { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Progressive Image Component
 *
 * Loads images progressively with blur-up effect for better perceived performance
 * - Shows low-quality placeholder while full image loads
 * - Smooth fade-in transition when image is ready
 * - Supports lazy loading for below-the-fold images
 *
 * @example
 * <ProgressiveImage
 *   src="https://example.com/image.jpg"
 *   placeholder="data:image/svg+xml..."
 *   alt="Description"
 *   loading="lazy"
 * />
 */
const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23FAF7F2" width="400" height="300"/%3E%3C/svg%3E',
  alt,
  className = '',
  loading = 'lazy',
}) => {
  const [imgSrc, setImgSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Preload the actual image
    const img = new Image();

    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };

    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-brand-nude ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="text-center p-8">
          <svg
            className="w-12 h-12 mx-auto text-brand-accent mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs text-brand-dark/40">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading={loading}
      className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-500 ease-out`}
    />
  );
};

export default ProgressiveImage;
