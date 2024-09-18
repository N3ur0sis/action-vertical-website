import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import Masonry from "react-masonry-css";

const ImageGalleryModal = ({ isOpen, onClose, images, handleInsertImage }) => {
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
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center ">
            <Dialog.Panel
              className={`w-full max-w-4xl max-h-[80vh] transform overflow-y-auto rounded-2xl bg-white text-left align-middle shadow-xl transition-all ml-0 sm:ml-64`}
            >
              <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b border-gray-200">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  Galerie d'images
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
                        className="w-full h-auto object-cover"
                        onClick={() => handleInsertImage(image)}
                      />
                    </div>
                  ))}
                </Masonry>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ImageGalleryModal;
