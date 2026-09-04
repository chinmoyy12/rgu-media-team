import React, { useState, useRef, useEffect } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  let variantClasses = '';
  switch (variant) {
    case 'circular':
      variantClasses = 'rounded-full';
      break;
    case 'text':
      variantClasses = 'rounded-md h-4';
      break;
    case 'rounded':
      variantClasses = 'rounded-2xl';
      break;
    case 'rectangular':
    default:
      variantClasses = 'rounded-lg';
      break;
  }

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      style={style}
      className={`relative overflow-hidden bg-stone-900/80 border border-stone-800/60 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-stone-800/40 before:to-transparent ${variantClasses} ${className}`}
    />
  );
};

export const MemberCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-3xl p-6 border border-stone-800/80 flex flex-col justify-between animate-pulse">
      <div>
        <div className="aspect-[4/3] w-full rounded-2xl mb-5 overflow-hidden">
          <Skeleton className="w-full h-full" variant="rounded" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-20 h-5" variant="rounded" />
          <Skeleton className="w-24 h-5" variant="rounded" />
        </div>
        <Skeleton className="w-3/4 h-6 mb-2" variant="text" />
        <Skeleton className="w-1/2 h-4 mb-4" variant="text" />
        <Skeleton className="w-full h-12" variant="rounded" />
      </div>
      <div className="mt-6 pt-4 border-t border-stone-800/80 flex justify-between items-center">
        <Skeleton className="w-20 h-4" variant="text" />
        <Skeleton className="w-8 h-8" variant="circular" />
      </div>
    </div>
  );
};

export const MediaGallerySkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-stone-800/80 flex flex-col justify-between">
      <div className="aspect-[4/3] w-full overflow-hidden">
        <Skeleton className="w-full h-full" variant="rectangular" />
      </div>
      <div className="p-5 bg-stone-950/90 border-t border-stone-800/80 flex items-center justify-between">
        <div className="w-full pr-4">
          <Skeleton className="w-2/3 h-5 mb-2" variant="text" />
          <Skeleton className="w-full h-3" variant="text" />
        </div>
        <Skeleton className="w-8 h-8" variant="circular" />
      </div>
    </div>
  );
};

export const DepartmentCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-stone-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-12 h-12" variant="rounded" />
        </div>
        <Skeleton className="w-3/4 h-7 mb-3" variant="text" />
        <Skeleton className="w-full h-4 mb-2" variant="text" />
        <Skeleton className="w-5/6 h-4 mb-6" variant="text" />
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="w-16 h-6" variant="rounded" />
          <Skeleton className="w-20 h-6" variant="rounded" />
          <Skeleton className="w-14 h-6" variant="rounded" />
        </div>
      </div>
      <div className="pt-4 border-t border-stone-800/80 flex justify-between items-center">
        <Skeleton className="w-28 h-4" variant="text" />
        <Skeleton className="w-20 h-4" variant="text" />
      </div>
    </div>
  );
};

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  fallbackIcon?: React.ReactNode;
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = 'relative w-full h-full overflow-hidden',
  fallbackIcon,
  onError,
  onLoad,
  loading = 'eager',
  decoding = 'async',
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
      }
    }
  }, [src]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) onError(e);
  };

  return (
    <div className={wrapperClassName}>
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 z-10 w-full h-full" variant="rectangular" />
      )}
      {!hasError ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-150`}
          {...props}
        />
      ) : (
        <div className="w-full h-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500">
          {fallbackIcon || <span className="text-xs font-mono">Image Unavailable</span>}
        </div>
      )}
    </div>
  );
};
