import React, { useState, useEffect } from 'react';
import { mediaStore } from '../../core/services/mediaStore';
import { Film, Image as ImageIcon } from 'lucide-react';
import { MediaType } from '../../core/contracts';

interface ArchivalMediaProps {
  src: string;
  alt?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
  forceType?: MediaType;
  onClick?: () => void;
}

export const ArchivalMedia: React.FC<ArchivalMediaProps> = ({
  src,
  alt = 'Archival media',
  className = '',
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  poster,
  forceType,
  onClick,
}) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    if (!src) {
      setIsLoading(false);
      setResolvedUrl('');
      return;
    }

    const checkAndResolve = async () => {
      try {
        const url = await mediaStore.resolveMediaUrl(src);
        if (!isMounted) return;
        setResolvedUrl(url);

        if (forceType) {
          setIsVideo(forceType === 'video');
        } else {
          const meta = await mediaStore.getMediaMetadata(src);
          const isVid = meta?.mimeType?.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)($|\?)/i.test(src);
          setIsVideo(!!isVid);
        }
      } catch (err) {
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkAndResolve();

    return () => {
      isMounted = false;
    };
  }, [src, forceType]);

  if (!src || hasError || (!isLoading && !resolvedUrl)) {
    return (
      <div className={`flex items-center justify-center bg-museum-surface text-stone-600 ${className}`}>
        {isVideo ? <Film className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={resolvedUrl}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        poster={poster}
        onClick={onClick}
        playsInline
      />
    );
  }

  return (
    <img
      src={resolvedUrl}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      onClick={onClick}
      loading="lazy"
    />
  );
};
