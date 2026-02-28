import React, { useCallback } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { PhotoCard } from "./PhotoCard";
import type { Cloudinary } from "@cloudinary/url-gen";
import type { DisplayPhoto } from "../types";

interface VirtualPhotoGridProps {
  photos: DisplayPhoto[];
  cld: Cloudinary | null;
  selectedIds: Set<string>;
  isDeleting: boolean;
  onToggleSelect: (id: string) => void;
  onPreview: (photo: DisplayPhoto) => void;
  onDownload: (photo: DisplayPhoto) => void;
  onDelete: (photo: DisplayPhoto) => void;
}

export const VirtualPhotoGrid: React.FC<VirtualPhotoGridProps> = ({
  photos,
  cld,
  selectedIds,
  isDeleting,
  onToggleSelect,
  onPreview,
  onDownload,
  onDelete,
}) => {
  const itemContent = useCallback(
    (_index: number, photo: DisplayPhoto) => (
      <PhotoCard
        photo={photo}
        cld={cld}
        isSelected={selectedIds.has(photo.id)}
        isDeleting={isDeleting}
        onToggleSelect={onToggleSelect}
        onPreview={onPreview}
        onDownload={onDownload}
        onDelete={onDelete}
      />
    ),
    [
      cld,
      selectedIds,
      isDeleting,
      onToggleSelect,
      onPreview,
      onDownload,
      onDelete,
    ]
  );

  if (photos.length === 0) return null;

  return (
    <div
      className="rounded-xl sm:rounded-2xl -mx-1 px-1"
      style={{
        height: "calc(100vh - 20rem)",
        minHeight: 320,
      }}
    >
      <VirtuosoGrid
        style={{ height: "100%" }}
        totalCount={photos.length}
        data={photos}
        itemContent={itemContent}
        listClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 w-full"
        itemClassName="min-w-0 aspect-square"
        overscan={300}
      />
    </div>
  );
};
