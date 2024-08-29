'use client';

import React, { useEffect, useState, Fragment } from 'react';
import Masonry from 'react-masonry-css';
import { FiLink, FiTrash2, FiMaximize2, FiCheckCircle, FiX } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';
import Alert from './alert';

const Gallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToView, setImageToView] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  const IMAGES_PER_PAGE = 10;

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/images?page=${page}&limit=${IMAGES_PER_PAGE}`);
        const data = await res.json();

        // Ajouter uniquement les nouvelles images qui ne sont pas déjà présentes
        setImages((prevImages) => {
          const newImages = data.images.filter((img: string) => !prevImages.includes(img));
          return [...prevImages, ...newImages];
        });

        setHasMore(data.hasMore);
      } catch (error) {
        setAlert({ type: 'warning', message: 'Failed to fetch images.' });
        console.error('Failed to fetch images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setAlert({ type: 'info', message: 'Lien de l\'image copié dans le presse-papier !' });
  };

  const handleDeleteClick = (image: string) => {
    if (!isSelectionMode) {
      setSelectedImages([image]);
      setIsSelectionMode(true);
    } else {
      if (selectedImages.includes(image)) {
        setSelectedImages(selectedImages.filter((img) => img !== image));
        if (selectedImages.length === 1) {
          setIsSelectionMode(false);
        }
      } else {
        setSelectedImages([...selectedImages, image]);
      }
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: selectedImages }),
      });

      if (res.ok) {
        setImages(images.filter((image) => !selectedImages.includes(image)));
        setAlert({ type: 'success', message: 'Images supprimées avec succès.' });
        setSelectedImages([]);
        setIsSelectionMode(false);
      } else {
        setAlert({ type: 'warning', message: 'La suppression a échoué.' });
      }
    } catch (error) {
      console.error('Failed to delete images:', error);
      setAlert({ type: 'warning', message: 'Erreur lors de la suppression.' });
    } finally {
      setIsModalOpen(false);
    }
  };

  const openImageModal = (image: string) => {
    setImageToView(image);
  };

  const closeImageModal = () => {
    setImageToView(null);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedImages([]);
  };

  const renderImages = () => {
    return images.map((src, idx) => (
      <div
        key={idx}
        className={`relative overflow-hidden rounded-lg shadow-lg cursor-pointer ${isSelectionMode && selectedImages.includes(src) ? 'opacity-75' : ''}`}
        onClick={() => {
          if (isSelectionMode) {
            handleDeleteClick(src);
          } else {
            handleCopyLink(`${window.location.origin}${src}`);
          }
        }}
        style={{ userSelect: 'none' }} // Désactiver la sélection du texte pour éviter les bugs visuels
      >
        <div
          className={`absolute inset-0 z-10 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-2 ${isSelectionMode ? 'opacity-100' : ''}`}
        >
          {isSelectionMode && (
            <FiCheckCircle
              className={`w-6 h-6 ${selectedImages.includes(src) ? 'text-green-500' : 'text-white'}`}
            />
          )}
          {!isSelectionMode && (
            <>
              <FiLink className="w-4 h-4" />
              <FiMaximize2
                className="absolute bottom-2 right-2 text-white hover:text-gray-300 w-6 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  openImageModal(src);
                }}
              />
              <FiTrash2
                className="absolute top-2 right-2 text-red-500 hover:text-red-600 w-6 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(src);
                }}
              />
            </>
          )}
        </div>
        <img
          src={src}
          alt={`Image ${idx + 1}`}
          className="w-full h-auto max-w-full object-cover lazyload"
          loading="lazy"
        />
      </div>
    ));
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold text-center mb-8">Galerie</h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          duration={3000}
        />
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {renderImages()}
        {loading && Array.from({ length: IMAGES_PER_PAGE }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse flex items-center justify-center w-full h-36 bg-gray-300 rounded dark:bg-gray-700"
          >
            <svg
              className="w-10 h-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        ))}
      </Masonry>

      {isSelectionMode && selectedImages.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <span>{selectedImages.length} image(s) sélectionnée(s)</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-200"
          >
            Supprimer
          </button>
          <button
            onClick={exitSelectionMode}
            className="text-white hover:text-gray-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      )}

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Confirmer la suppression
                  </Dialog.Title>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Voulez-vous vraiment supprimer ces {selectedImages.length} image(s) ? Cette action est irréversible.
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                    onClick={confirmDelete}
                  >
                    Supprimer
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      <Transition appear show={!!imageToView && !isSelectionMode} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeImageModal}>
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
              <Dialog.Panel className="w-full max-w-3xl max-h-full transform overflow-y-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Image grand format
                  </Dialog.Title>
                  <button onClick={closeImageModal} className="text-gray-400 hover:text-gray-600">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                {imageToView && (
                  <img
                    src={imageToView}
                    alt="Image grand format"
                    className="w-full h-auto max-h-[80vh] object-contain mx-auto"
                  />
                )}
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Gallery;
