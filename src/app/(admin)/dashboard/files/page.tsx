"use client";

import React, { useState, useEffect } from "react";
import { FiTrash, FiEye, FiCheck, FiPlus, FiVideo, FiX, FiLink } from "react-icons/fi";
import Alert from "@/components/alert";
import { Dialog, Transition } from "@headlessui/react";

const AdminFilesPage = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchFiles(1); // Réinitialise les fichiers lors de la modification de la recherche
  }, [searchQuery]);
  
  useEffect(() => {
    fetchFiles(page); // Charge les fichiers lors du défilement
  }, [page]);
  

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setIsSelectionMode(false);
    }
  }, [selectedFiles]);

  const fetchFiles = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files?page=${pageNumber}&limit=10&search=${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        if (pageNumber === 1) {
          setFiles(data.files);
        } else {
          setFiles(prevFiles => [...prevFiles, ...data.files]);
        }
        setHasMore(data.hasMore);
      } else {
        throw new Error("Échec du chargement des fichiers");
      }
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const resetTableAndFetchFiles = () => {
    setFiles([]);
    setPage(1);
    fetchFiles(1);
  };

  const deleteFiles = async () => {
    try {
      const res = await fetch(`/api/deleting-files`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: selectedFiles }),
      });
      if (!res.ok) {
        throw new Error("Échec de la suppression des fichiers");
      }
      setAlert({ type: "success", message: "Fichiers supprimés avec succès" });
      resetTableAndFetchFiles();
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setIsDeleteModalOpen(false);
      setIsSelectionMode(false);
      setSelectedFiles([]);
    }
  };

  const handleAddFile = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload_file", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setAlert({ type: "success", message: "Fichier téléchargé avec succès" });
        resetTableAndFetchFiles(); // Recharger les fichiers après upload
      } else {
        throw new Error("Échec du téléchargement du fichier");
      }
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    }
  };

  const handleAddVideo = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append("video", file);

    try {
      const res = await fetch("/api/upload_video", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setAlert({ type: "success", message: "Vidéo téléchargée avec succès" });
        resetTableAndFetchFiles(); // Recharger les fichiers après upload
      } else {
        throw new Error("Échec du téléchargement de la vidéo");
      }
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    }
  };

  const toggleSelection = (fileName) => {
    if (selectedFiles.includes(fileName)) {
      setSelectedFiles(selectedFiles.filter((name) => name !== fileName));
    } else {
      setSelectedFiles([...selectedFiles, fileName]);
    }
  };

  const handleDeleteClick = (fileName) => {
    setIsSelectionMode(true);
    toggleSelection(fileName);
  };

  const handleBulkDeleteClick = () => {
    if (selectedFiles.length > 0) {
      setIsDeleteModalOpen(true);
    } else {
      setAlert({ type: "warning", message: "Aucun fichier sélectionné pour la suppression" });
    }
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedFiles([]);
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    setAlert({ type: "info", message: "Lien copié dans le presse-papiers" });
  };

  const handleRowClick = (file) => {
    if (isSelectionMode) {
      toggleSelection(file.name);
    } else {
      handleCopyLink(`${window.location.origin}/files/${file.name}`);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight && hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };
  

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="p-4 sm:p-8 bg-white">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Gérer les fichiers</h1>
        <div className="flex items-center space-x-4 flex-wrap">
          <input
            type="text"
            placeholder="Rechercher un fichier..."
            value={searchQuery}
            onChange={(e) => {
  setSearchQuery(e.target.value);
  setFiles([]); // Clear current files
  setPage(1); // Reset to page 1
}}

            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 sm:mb-0"
          />
          <label className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 cursor-pointer">
            <FiPlus className="w-5 h-5" />
            <span>Ajouter un fichier</span>
            <input type="file" accept=".pdf,.doc,.docx,.txt,.odt,.ppt,.pptx,.xls,.xlsx,video/*" className="hidden" onChange={handleAddFile} />
          </label>
          <label className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 cursor-pointer">
            <FiVideo className="w-5 h-5" />
            <span>Ajouter une vidéo</span>
            <input type="file" accept="video/*" className="hidden" onChange={handleAddVideo} />
          </label>
        </div>
      </div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          duration={3000}
        />
      )}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 max-w-xs truncate">Nom du fichier</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Taille</th>
              <th scope="col" className="px-6 py-3">Date d'ajout</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file.name}
                className={`border-b cursor-pointer ${selectedFiles.includes(file.name) ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => handleRowClick(file)}
              >
                <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                  {file.name}
                </td>
                <td className="px-6 py-4">{file.type}</td>
                <td className="px-6 py-4">{file.size}</td>
                <td className="px-6 py-4">
                  {new Date(file.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 flex space-x-4 items-center">
                  <a href={`/files/${file.name}`} target="_blank" rel="noopener noreferrer">
                    <FiEye className="text-blue-600 cursor-pointer w-6 h-6" />
                  </a>
                  <FiLink
                    className="text-gray-600 cursor-pointer w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink(`${window.location.origin}/files/${file.name}`);
                    }}
                  />
                  {selectedFiles.includes(file.name) ? (
                    <FiCheck
                      className="text-green-600 cursor-pointer w-6 h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(file.name);
                      }}
                    />
                  ) : (
                    <FiTrash
                      className="text-red-600 cursor-pointer w-6 h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(file.name);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="space-y-4 mt-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isSelectionMode && (
        <div className="fixed bottom-4 right-4 flex items-center space-x-4">
          <button
            onClick={exitSelectionMode}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"
          >
            <FiX className="w-5 h-5" />
            <span>Annuler</span>
          </button>
          <button
            onClick={handleBulkDeleteClick}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Supprimer les fichiers sélectionnés
          </button>
        </div>
      )}

      <Transition appear show={isDeleteModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Confirmer la suppression
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer le(s) fichier(s) sélectionné(s) ? Cette action est irréversible.
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                    onClick={deleteFiles}
                  >
                    Supprimer
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdminFilesPage;
