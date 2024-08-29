'use client';

import React, { useState } from 'react';
import Alert from './alert';
import { FiUpload, FiImage } from 'react-icons/fi';

const ImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));

    try {
      setUploading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setAlert({ type: 'success', message: 'Vos images ont été téléchargées avec succès.' });
        setSelectedFiles([]);
        setTimeout(() => {
          window.location.reload(); // Rafraîchir la page après l'upload
        }, 1500);
      } else {
        setAlert({ type: 'warning', message: "Échec de l'upload" });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erreur! ' + error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="flex flex-col items-center my-4">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          duration={3000}
        />
      )}

      <div className="relative">
        <label
          htmlFor="file-input"
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {uploading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0l4 4-4 4V6a6 6 0 00-6 6H4z"
              ></path>
            </svg>
          ) : (
            <>
              <FiImage className="w-5 h-5" />
              <span> Sélectionner des fichiers </span>
            </>
          )}
        </label>
        <input
          id="file-input"
          type="file"
          onChange={handleFilesChange}
          accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff"
          multiple
          className="hidden"
          disabled={uploading}
        />
      </div>

      <p className="mt-2 text-sm text-gray-500">Formats supportés : .jpg, .jpeg, .png, .webp, .gif, .bmp, .tiff</p>

      <p className="mt-2 text-sm text-gray-600">
        {selectedFiles.length > 0
          ? `${selectedFiles.length} fichiers sélectionnés`
          : 'Aucun fichier choisi'}
      </p>

      <button
        className="mt-4 bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
      >
        <FiUpload className="w-5 h-5" />
        <span>{uploading ? 'Envoi en cours...' : 'Commencer l\'upload'}</span>
      </button>
    </div>
  );
};

export default ImageUpload;
