import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import { PhotoImage } from "./PhotoImage";
import type { Cloudinary } from "@cloudinary/url-gen";
import type { Photo } from "../../../types";

export interface LazyPhotoImageProps {
  photo: Pick<Photo, "url" | "filename" | "public_id">;
  cld: Cloudinary | null;
  /** For thumbnails: width/height for resize. Required for lazy behavior. */
  thumbSize?: number;
  className?: string;
  /** Pixels from viewport edge to start loading (default 200). */
  rootMargin?: string;
}

/**
 * Renders a placeholder until the image is in view, then loads the real image.
 * Use in grids/lists to avoid loading dozens of images at once; keeps modals using PhotoImage for full-size.
 */
const LazyPhotoImageInner: React.FC<LazyPhotoImageProps> = ({
  photo,
  cld,
  thumbSize = 400,
  className,
  rootMargin = "200px",
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onIntersect = useCallback<IntersectionObserverCallback>(([entry]) => {
    if (entry?.isIntersecting) setInView(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin,
      threshold: 0.01,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect, rootMargin]);

  if (inView) {
    return (
      <PhotoImage
        photo={photo}
        cld={cld}
        thumbSize={thumbSize}
        className={className}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={`bg-slate-200 dark:bg-gray-700 animate-pulse ${className ?? ""}`}
      aria-label={photo.filename}
    />
  );
};

export const LazyPhotoImage = memo(LazyPhotoImageInner);
