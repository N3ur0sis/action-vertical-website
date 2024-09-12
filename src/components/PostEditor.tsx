"use client";

import React, { useState, useEffect } from "react";
import Editor from "./post-editor/Editor";
import CoverImageUploader from "./post-editor/CoverImageUploader";
import ImageGalleryModal from "./post-editor/ImageGalleryModal";
import FileModal from "./post-editor/FileModal";
import InsertGalleryModal from "./post-editor/InsertGalleryModal";
import ImagePreviewModal from "./post-editor/ImagePreviewModal";
import Alert from "./alert";
import { createPost } from "@/actions/actions";

// Skeleton component for loading state
const SkeletonLoader = () => (
  <div className="animate-pulse m-40">
    <div className="h-8 bg-gray-300 rounded mb-6 w-3/4 mx-auto"></div>
    <div className="h-12 bg-gray-300 rounded mb-4"></div>
    <div className="h-10 bg-gray-300 rounded mb-4"></div>
    <div className="h-80 bg-gray-300 rounded mb-4"></div>
    <div className="flex gap-4">
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);

export default function PostEditor() {
  const [model, setModel] = useState("");
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("/bg.jpeg");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isInsertGalleryModalOpen, setIsInsertGalleryModalOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "", isVisible: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading state
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message, isVisible: true });
    setTimeout(() => setAlert({ type, message, isVisible: false }), 3000);
  };

  const handleInsertImage = (imageUrl) => {
    setModel(
      model + `<img src="${imageUrl}" style="width:100%;height:auto;" alt="Image insérée" />`
    );
    setIsGalleryOpen(false);
  };

  const handleInsertMedia = (mediaUrl) => {
    setModel(
      model + `<iframe src="${mediaUrl}" style="width:100%;height:500px;" frameborder="0"></iframe>`
    );
    setIsFileModalOpen(false);
  };

  const handleInsertGallery = (selectedImages) => {
    if (!Array.isArray(selectedImages)) {
      console.error("Selected images are not an array:", selectedImages);
      return;
    }

    const galleryHTML = `
      <div class="masonry" style="column-count: 3; column-gap: 10px;">
        ${selectedImages
          .map(
            (src) => `
          <div class="masonry-item" style="break-inside: avoid; margin-bottom: 10px;">
            <img src="${src}" style="width:100%; height:auto; border-radius: 8px;" alt="Gallery Image"/>
          </div>
        `
          )
          .join("")}
      </div>
    `;
    setModel((prevModel) => `${prevModel}${galleryHTML}`);
    setIsInsertGalleryModalOpen(false);
  };

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/all-images");
      if (res.ok) {
        const data = await res.json();
        setImages(data.images);
      } else {
        showAlert("error", "Échec du chargement des images.");
      }
    } catch (error) {
      showAlert("error", "Erreur lors du chargement des images.");
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch(`/api/files`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
      } else {
        console.error("Failed to load files");
      }
    } catch (error) {
      console.error("Error loading files:", error);
    }
  };

  const handleSubmit = async (isPublished) => {
    if (!title) {
      showAlert("error", "Le titre est obligatoire pour publier l'article.");
      return;
    }
    try {
      await createPost({
        title,
        content: model,
        coverImage,
        isPublished, // Indiquer si le post est publié ou en brouillon
      });
      showAlert("success", `Article ${isPublished ? 'publié' : 'mis en brouillon'} avec succès!`);
      setTitle("");
      setModel("");
      setCoverImage("/bg.jpeg");
    } catch (error) {
      showAlert("error", "Erreur lors de la publication de l'article.");
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      {alert.isVisible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "", isVisible: false })}
        />
      )}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Créer un nouvel article
        </h2>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Titre du nouvel article"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <CoverImageUploader
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            onClick={() => setIsImagePreviewOpen(true)}
          />

          <Editor model={model} setModel={setModel} />

          <div className="flex gap-4">
            <button
              type="button"
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => {
                fetchImages();
                setIsGalleryOpen(true);
              }}
            >
              Insérer une image
            </button>
            <button
              type="button"
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => {
                fetchFiles();
                setIsFileModalOpen(true);
              }}
            >
              Insérer un fichier ou une vidéo
            </button>
            <button
              type="button"
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                fetchImages();
                setIsInsertGalleryModalOpen(true);
              }}
            >
              Insérer une galerie
            </button>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none"
              onClick={() => handleSubmit(false)}  // Mettre en brouillon
            >
              Mettre en brouillon
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}  // Publier
              className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Publier
            </button>
          </div>
        </form>
      </div>

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={images}
        handleInsertImage={handleInsertImage}
      />

      <FileModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        files={files}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleInsertMedia={handleInsertMedia}
      />

      <InsertGalleryModal
        isOpen={isInsertGalleryModalOpen}
        onClose={() => setIsInsertGalleryModalOpen(false)}
        onInsert={handleInsertGallery}
      />

      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        imageUrl={coverImage}
      />
    </main>
  );
}
