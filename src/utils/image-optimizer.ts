export interface ImageSrcSetConfig {
  src: string;
  widths: readonly number[];
  format?: 'webp' | 'avif';
}

export interface OptimizedImageAttributes {
  loading: 'lazy' | 'eager';
  fetchpriority: 'high' | 'low' | 'auto';
  decoding: 'async' | 'sync' | 'auto';
}

const LCP_IMAGE_PATTERNS: readonly string[] = [
  'happy-customer',
  'hero',
  'banner',
  'cover',
] as const;

function isLcpImage(src: string): boolean {
  const lowerSrc = src.toLowerCase();
  return LCP_IMAGE_PATTERNS.some(pattern => lowerSrc.includes(pattern));
}

export function getImageOptimizationAttributes(src: string): OptimizedImageAttributes {
  if (isLcpImage(src)) {
    return {
      loading: 'eager',
      fetchpriority: 'high',
      decoding: 'async',
    };
  }

  return {
    loading: 'lazy',
    fetchpriority: 'auto',
    decoding: 'async',
  };
}

export function generateSrcSet(config: ImageSrcSetConfig): string {
  const { src, widths, format } = config;

  return widths
    .map(width => {
      const basePath = src.replace(/\.[^.]+$/, '');
      const extension = format ?? 'webp';
      const optimizedSrc = `${basePath}-${width}w.${extension}`;
      return `${optimizedSrc} ${width}w`;
    })
    .join(', ');
}

export function isDecorativeImage(alt: string): boolean {
  return alt.trim() === '';
}
