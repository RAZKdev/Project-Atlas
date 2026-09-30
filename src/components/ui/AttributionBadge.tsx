import React from 'react';
import { ImageAttribution } from '../../core/contracts';
import { Camera, ExternalLink } from 'lucide-react';

interface AttributionBadgeProps {
  attribution?: ImageAttribution;
  isPersonal?: boolean;
  className?: string;
}

export const AttributionBadge: React.FC<AttributionBadgeProps> = ({
  attribution,
  isPersonal = false,
  className = ''
}) => {
  if (isPersonal) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-[11px] font-mono text-earth-300 bg-museum-base/80 backdrop-blur-sm px-2.5 py-1 rounded border border-earth-500/30 ${className}`}>
        <Camera className="w-3 h-3 text-earth-400" />
        <span>Personal Archive Photo</span>
      </div>
    );
  }

  if (!attribution) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 text-[11px] font-mono text-parchment-400 bg-museum-base/85 backdrop-blur-sm px-2.5 py-1 rounded border border-museum-border ${className}`}>
      <span className="text-stone-400">Photo:</span>
      <span className="text-parchment-200">{attribution.photographer || 'Curated Reference'}</span>
      {attribution.source && (
        <>
          <span className="text-stone-600">•</span>
          <span className="text-stone-400">{attribution.source}</span>
        </>
      )}
      {attribution.sourceUrl && (
        <a
          href={attribution.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-earth-400 hover:text-earth-300 ml-0.5 inline-flex items-center"
          title="View source"
        >
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}
    </div>
  );
};
