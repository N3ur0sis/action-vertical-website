import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import ImageGallery from "@/components/post-editor/ImageGallery";

const CoverImageUploader = ({ coverImage, setCoverImage }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openGalleryModal = () => {
    setIsGalleryOpen(true);
  };

  const closeGalleryModal = () => setIsGalleryOpen(false);

  const selectImage = (imageUrl) => {
    setCoverImage(imageUrl);
    closeGalleryModal();
  };

  const handleUploadCoverImage = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append("files", file);

    try {
      const res = await fetch("/api/upload_image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.urls[0]);
      } else {
        console.error("Échec du téléchargement de l'image de couverture");
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image de couverture:", error);
    }
  };

  return (
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
            onClick={openGalleryModal}
          />
        )}
        <button
          type="button"
          className="mt-2 mb-2 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={openGalleryModal}
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

      {/* Modal for image gallery */}
      <Transition appear show={isGalleryOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeGalleryModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
              <Dialog.Panel
                className={`w-full max-w-4xl max-h-[80vh] transform overflow-y-auto rounded-2xl bg-white text-left align-middle shadow-xl transition-all ${
                  !isSmallScreen ? 'ml-64' : ''
                }`}
              >
                <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b border-gray-200">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                    Galerie d'images
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeGalleryModal}
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  <ImageGallery onSelectImage={selectImage} />
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CoverImageUploader;
