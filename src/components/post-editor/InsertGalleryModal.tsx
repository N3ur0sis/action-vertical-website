import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import Masonry from "react-masonry-css";

const InsertGalleryModal = ({ isOpen, onClose, onInsert }) => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/all-images");
        if (res.ok) {
          const data = await res.json();
          setImages(data.images);
        } else {
          console.error("Failed to fetch images");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const handleImageSelect = (src) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(src)
        ? prevSelected.filter((image) => image !== src)
        : [...prevSelected, src]
    );
  };

  const handleInsertGallery = () => {
    onInsert(selectedImages);
    setSelectedImages([]);
    onClose();
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              className={`w-full max-w-4xl max-h-[80vh] transform overflow-y-auto rounded-2xl bg-white text-left align-middle shadow-xl transition-all ml-0 sm:ml-64` }
            >
              <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b border-gray-200">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  Sélectionner des images pour la galerie
                </Dialog.Title>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={onClose}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {images.map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer mb-4">
                      <img
                        src={image}
                        alt={`Gallery Image ${index + 1}`}
                        className={`w-full h-auto object-cover ${selectedImages.includes(image) ? "border-4 border-blue-500" : ""}`}
                        onClick={() => handleImageSelect(image)}
                      />
                    </div>
                  ))}
                </Masonry>
              </div>
              <div className="sticky bottom-0 bg-white z-10 p-4 flex justify-end border-t border-gray-200">
                <button
                  type="button"
                  className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                  onClick={handleInsertGallery}
                >
                  Insérer la galerie
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default InsertGalleryModal;
