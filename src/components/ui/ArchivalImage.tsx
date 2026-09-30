import React, { useState, useEffect } from 'react';
import { mediaStore } from '../../core/services/mediaStore';
import { Camera } from 'lucide-react';

interface ArchivalImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackIcon?: React.ReactNode;
}

export const ArchivalImage: React.FC<ArchivalImageProps> = ({
  src,
  fallbackIcon,
  className = '',
  alt = 'Archival photograph',
  ...props
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!src) {
      setResolvedSrc('');
      setIsLoading(false);
      return;
    }

    if (!src.startsWith('local-media:')) {
      setResolvedSrc(src);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    mediaStore.resolveMediaUrl(src).then(url => {
      if (isMounted) {
        setResolvedSrc(url);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (!src || (!resolvedSrc && !isLoading)) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-museum-card text-stone-600 ${className}`}>
        {fallbackIcon || <Camera className="w-8 h-8 opacity-40" />}
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc || src}
      alt={alt}
      className={`${isLoading ? 'opacity-50 blur-sm' : 'opacity-100'} transition-all duration-300 ${className}`}
      {...props}
    />
  );
};
