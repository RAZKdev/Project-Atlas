import React from 'react';
import { Compass } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "The atlas is quiet for now.",
  description = "Start by documenting a place that matters to you, or browse the world catalog.",
  actionLabel = "Add a Memory",
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-museum-border bg-museum-surface/50 max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-full bg-museum-card flex items-center justify-center text-earth-400 border border-museum-border mb-4">
        {icon || <Compass className="w-7 h-7" />}
      </div>
      <h3 className="font-serif text-xl text-parchment-200 mb-2">{title}</h3>
      <p className="text-sm text-parchment-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
