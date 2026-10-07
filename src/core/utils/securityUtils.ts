/**
 * securityUtils.ts
 * Security validation and input sanitization helpers based on OWASP ASVS 5.0.0.
 */

const ALLOWED_PROTOCOLS = ['https:', 'http:', 'local-media:'];

/**
 * Validates external and local media URLs to reject active script schemes (e.g. javascript:, vbscript:)
 * and unverified data URI payloads.
 */
export function isValidMediaUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();

  // Local media blob key from IndexedDB
  if (trimmed.startsWith('local-media:')) {
    return /^local-media:[a-zA-Z0-9_\-.:]+$/.test(trimmed);
  }

  // Local static relative asset paths
  if (
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('./') ||
    trimmed === '/compass.svg'
  ) {
    return !trimmed.includes('..') && !trimmed.includes('\\');
  }

  // Safe Data URIs (strictly restricted to image & video media mime types)
  if (trimmed.startsWith('data:')) {
    return /^data:(image\/(jpeg|png|webp|gif|avif|svg\+xml)|video\/(mp4|webm|ogg));base64,[A-Za-z0-9+/=]+$/.test(
      trimmed
    );
  }

  // Standard absolute HTTP/HTTPS URLs
  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return false;
    }
    if (parsed.username || parsed.password) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes plain text input by stripping null bytes, control characters, and bounding length.
 */
export function sanitizePlainText(text: string, maxLength: number = 2000): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\0/g, '')
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitizes search queries by stripping HTML tags, brackets, null characters, and limiting length.
 */
export function sanitizeSearchQuery(query: string, maxLength: number = 100): string {
  if (!query || typeof query !== 'string') return '';
  return query
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[<>{}\\]/g, ' ')
    .replace(/\0/g, '')
    .trim()
    .slice(0, maxLength);
}
