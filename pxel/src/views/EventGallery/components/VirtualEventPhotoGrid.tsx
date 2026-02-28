import React, { useCallback } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { EventPhotoCard } from "./EventPhotoCard";
import type { Cloudinary } from "@cloudinary/url-gen";
import type { Photo } from "../../../types";

interface VirtualEventPhotoGridProps {
  photos: Photo[];
  cld: Cloudinary | null;
  isInAlbum: (photoId: string) => boolean;
  isTogglingPhoto: (photoId: string) => boolean;
  isSubmitting: boolean;
  isAlbumLocked: boolean;
  isAlbumFull: boolean;
  onToggleAlbum: (photo: Photo) => void;
  onPreview: (photo: Photo) => void;
}

export const VirtualEventPhotoGrid: React.FC<VirtualEventPhotoGridProps> = ({
  photos,
  cld,
  isInAlbum,
  isTogglingPhoto,
  isSubmitting,
  isAlbumLocked,
  isAlbumFull,
  onToggleAlbum,
  onPreview,
}) => {
  const itemContent = useCallback(
    (_index: number, photo: Photo) => (
      <EventPhotoCard
        photo={photo}
        cld={cld}
        isInAlbum={isInAlbum(photo.id)}
        isToggling={isTogglingPhoto(photo.id)}
        isSubmitting={isSubmitting}
        isAlbumLocked={isAlbumLocked}
        isAlbumFull={isAlbumFull}
        onToggleAlbum={onToggleAlbum}
        onPreview={onPreview}
      />
    ),
    [
      cld,
      isInAlbum,
      isTogglingPhoto,
      isSubmitting,
      isAlbumLocked,
      isAlbumFull,
      onToggleAlbum,
      onPreview,
    ]
  );

  if (photos.length === 0) return null;

  return (
    <div
      className="rounded-2xl -mx-1 px-3 sm:px-2 md:px-1"
      style={{ height: "calc(100vh - 18rem)", minHeight: 400 }}
    >
      <VirtuosoGrid
        style={{ height: "100%" }}
        totalCount={photos.length}
        data={photos}
        itemContent={itemContent}
        listClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6 w-full"
        itemClassName="min-w-0 aspect-square"
        overscan={300}
      />
    </div>
  );
};
