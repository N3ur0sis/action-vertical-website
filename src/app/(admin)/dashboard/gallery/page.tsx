import React from "react";
import ImageUpload from "@/components/image-upload";
import Gallery from "@/components/gallery";

function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8">Gestionnaire d'images</h1>
      <ImageUpload />
      <Gallery />
    </div>
  );
}

export default GalleryPage;
