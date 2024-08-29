"use client";

import React, { useState, Fragment } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/file.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/video.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import { createPost } from "@/actions/actions";
import { Dialog, Transition } from "@headlessui/react";
import Alert from "@/components/alert";

export default function PostEditor() {
  const [model, setModel] = useState("");
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("/bg.jpeg"); // Image de couverture par défaut
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isCoverImageModalOpen, setIsCoverImageModalOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "", isVisible: false });
  const [page, setPage] = useState(1);

  const showAlert = (type, message) => {
    setAlert({ type, message, isVisible: true });
    setTimeout(() => setAlert({ type: "", message: "", isVisible: false }), 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (title.trim()) {
      await createPost({ title, content: model, coverImage });
      showAlert("success", "L'article a été publié avec succès.");
      setModel("");
      setTitle("");
      setCoverImage("/bg.jpeg"); // Réinitialiser à l'image par défaut après la publication
    } else {
      showAlert("warning", "Le titre est requis.");
    }
  };

  const handleInsertImage = (imageUrl) => {
    setModel(
      model + `<img src="${imageUrl}" style="width:100%;height:auto;" alt="Image insérée" />`
    );
    closeGalleryModal();
  };

  const handleSetCoverImage = (imageUrl) => {
    setCoverImage(imageUrl);
    closeCoverImageModal();
  };

  const handleUploadCoverImage = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append("files", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.urls[0]);
        showAlert("success", "Image de couverture téléchargée avec succès.");
      } else {
        throw new Error("Échec du téléchargement de l'image de couverture");
      }
    } catch (error) {
      showAlert("error", "Erreur lors du téléchargement de l'image de couverture.");
    }
  };
// Ajoutez cette ligne dans la fonction `PostEditor` avant d'utiliser `filteredFiles`
const filteredFiles = files.filter((file) =>
  file.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images?page=1&limit=-1"); // Récupérer toutes les images
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
      const res = await fetch(`/api/files?limit=-1`); // Retrieve all files
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


  // Ajoutez cette fonction à l'intérieur du composant PostEditor, de préférence après la définition de `handleInsertImage` ou `handleSetCoverImage`.

const handleInsertMedia = (mediaUrl) => {
  setModel(
    model + `<iframe src="${mediaUrl}" style="width:100%;height:500px;" frameborder="0"></iframe>`
  );
  closeFileModal(); // Fermer le modal après l'insertion
};


  const openGalleryModal = () => {
    fetchImages();
    setIsGalleryOpen(true);
  };

  const closeGalleryModal = () => setIsGalleryOpen(false);

  const openFileModal = () => {
    fetchFiles();
    setIsFileModalOpen(true);
  };

  const closeFileModal = () => setIsFileModalOpen(false);

  const openCoverImageModal = () => {
    fetchImages();
    setIsCoverImageModalOpen(true);
  };

  const closeCoverImageModal = () => setIsCoverImageModalOpen(false);

  const openImagePreview = () => setIsImagePreviewOpen(true);
  const closeImagePreview = () => setIsImagePreviewOpen(false);

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
              Image de couverture
            </label>
            <div className="mt-1 flex items-center">
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover Image"
                  className="h-24 w-24 object-cover rounded mr-4 cursor-pointer"
                  onClick={openImagePreview} // Ouvre la prévisualisation en plein écran
                />
              )}
              <button
                type="button"
                className="mt-2 mb-2 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={openCoverImageModal}
              >
                Choisir une image de couverture
              </button>
              <label className="ml-4 cursor-pointer text-sm font-medium text-blue-600 hover:underline">
                Uploader une nouvelle image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadCoverImage}
                />
              </label>
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Contenu
            </label>
            <FroalaEditor
              model={model}
              onModelChange={(e) => setModel(e)}
              config={{
                height: 400,
                placeholderText: "Commencez à écrire votre article...",
                pluginsEnabled: [
                  "image",
                  "file",
                  "link",
                  "table",
                  "lists",
                  "paragraphFormat",
                  "align",
                  "fontFamily",
                  "fontSize",
                  "colors",
                  "quote",
                  "video", // Plugin vidéo
                ],
                toolbarButtons: [
                  "bold", "italic", "underline", "strikeThrough", "subscript", "superscript", "fontFamily",
                  "fontSize", "color", "inlineStyle", "paragraphStyle", "paragraphFormat", "align", "formatOL",
                  "formatUL", "outdent", "indent", "quote", "insertLink", "insertImage", "insertVideo", "insertFile",
                  "insertTable", "emoticons", "specialCharacters", "insertHR", "clearFormatting", "html", "fullscreen"
                ],
                videoInsertButtons: ['videoBack', '|', 'videoByURL', 'videoEmbed'],
                videoUploadURL: "/api/upload_video",
                videoAllowedTypes: ['mp4', 'webm', 'ogg'],
                videoDefaultDisplay: 'inline',
                videoDefaultAlign: 'center',
                toolbarSticky: true,
                toolbarStickyOffset: 0,
                fileUploadURL: "/api/upload_file",
                fileAllowedTypes: [
                  "application/pdf", 
                  "text/plain", 
                  "application/msword", 
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ],
                events: {
                  "video.inserted": function ($video, response) {
                    console.log("Vidéo insérée avec succès !");
                  },
                  "video.error": function (error, response) {
                    console.error("Erreur lors de l'insertion de la vidéo:", error, response);
                  },
                  "file.uploaded": function (response) {
                    const fileUrl = JSON.parse(response).link;
                    const fileName = fileUrl.split("/").pop();
                    this.html.insert(
                      `<a href="${fileUrl}" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold;">${fileName}</a>`
                    );
                  },
                  "file.inserted": function ($file, response) {
                    const fileUrl = JSON.parse(response).link;
                    this.html.insert(
                      `<iframe src="${fileUrl}" style="width:100%;height:500px;" frameborder="0"></iframe>`
                    );
                  },
                  "file.error": function (error, response) {
                    console.error("Erreur lors de l'upload du fichier:", error, response);
                  },
                },
              }}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={openGalleryModal}
            >
              Insérer une image
            </button>
            <button
              type="button"
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={openFileModal}
            >
              Insérer un fichier ou une vidéo
            </button>
            <button
              type="submit"
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Publier
            </button>
          </div>
        </form>
      </div>

      <Transition appear show={isGalleryOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeGalleryModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
              <Dialog.Panel className="w-full max-w-4xl max-h-[80vh] transform overflow-y-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  Galerie d'images
                </Dialog.Title>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="cursor-pointer hover:opacity-75"
                      onClick={() => handleInsertImage(image)}
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                    onClick={closeGalleryModal}
                  >
                    Fermer
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      <Transition appear show={isFileModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeFileModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
              <Dialog.Panel className="w-full max-w-4xl max-h-[80vh] transform overflow-y-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  Insérer un fichier ou une vidéo
                </Dialog.Title>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Rechercher un fichier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                  />
                  <div className="max-h-40 overflow-y-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">Nom du fichier</th>
                          <th className="py-2 px-4 border-b">Type</th>
                          <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFiles.map((file) => (
                          <tr key={file.name} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b truncate">{file.name}</td>
                            <td className="py-2 px-4 border-b">{file.type}</td>
                            <td className="py-2 px-4 border-b">
                              <button
                                className="bg-blue-500 text-white py-1 px-3 rounded"
                                onClick={() => handleInsertMedia(`/files/${file.name}`)}
                              >
                                Insérer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                    onClick={closeFileModal}
                  >
                    Fermer
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      <Transition appear show={isCoverImageModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeCoverImageModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
              <Dialog.Panel className="w-full max-w-4xl max-h-[80vh] transform overflow-y-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  Choisir une image de couverture
                </Dialog.Title>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="cursor-pointer hover:opacity-75"
                      onClick={() => handleSetCoverImage(image)}
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                    onClick={closeCoverImageModal}
                  >
                    Fermer
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      <Transition appear show={isImagePreviewOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeImagePreview}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center">
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <img src={coverImage} alt="Cover Image Preview" className="w-full h-auto" />
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </main>
  );
}
