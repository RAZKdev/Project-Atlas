/**
 * useModalFocusTrap.ts
 * Accessible focus trap and keyboard dismissal hook for dialog modals (WCAG AA compliant).
 */

import { useEffect, useRef } from 'react';

export function useModalFocusTrap(
  isOpen: boolean,
  onClose: () => void,
  containerRef: React.RefObject<HTMLElement | null>
) {
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Capture previously focused element
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      previousActiveElementRef.current = document.activeElement;
    }

    const container = containerRef.current;
    if (!container) return;

    const focusableSelectors =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = () => {
      if (!container) return [];
      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((el) => el.offsetParent !== null);
    };

    // 2. Initial focus transfer to first interactive control
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    } else {
      container.setAttribute('tabindex', '-1');
      container.focus();
    }

    // 3. Trap focus navigation inside container & handle Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          // Backward tab (Shift + Tab)
          if (document.activeElement === first || document.activeElement === container) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Forward tab (Tab)
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // 4. Restore focus to original active trigger on modal unmount
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose, containerRef]);
}
