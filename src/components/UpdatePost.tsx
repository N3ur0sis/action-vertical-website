import React, { useState, useEffect, Fragment } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/file.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import { Dialog, Transition } from '@headlessui/react';

const UpdatePost = ({ post, isOpen, onClose, onUpdate }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');
  const [coverImage, setCoverImage] = useState(post?.coverImage || "/bg.jpeg");
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isCoverImageModalOpen, setIsCoverImageModalOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setCoverImage(post.coverImage); // Assurez-vous que l'image de couverture spécifique est définie
    }
    fetchFiles();
  }, [post]);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`/api/files?page=${page}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setFiles((prevFiles) => [...prevFiles, ...data.files]);
      } else {
        console.error('Error fetching files.');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    if (isCoverImageModalOpen || isGalleryOpen) {
      fetchImages();
    }
  }, [page, isCoverImageModalOpen, isGalleryOpen]);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/all-images'); // Fetching all images at once
      if (res.ok) {
        const data = await res.json();
        setImages(data.images);
      } else {
        console.error("Error fetching images.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleScroll = (e) => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
      setPage((prevPage) => prevPage + 1);
    }
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
      } else {
        throw new Error("Failed to upload cover image");
      }
    } catch (error) {
      console.error("Error uploading cover image:", error);
    }
  };

  const handleInsertFile = (fileUrl) => {
    const fileWidget = `
      <div class="file-widget">
        <iframe src="${fileUrl}" style="width:100%;height:500px;" frameborder="0"></iframe>
        <p><a href="${fileUrl}" target="_blank" style="color:blue;">${fileUrl.split('/').pop()}</a></p>
      </div>`;
    setBody(body + fileWidget);
    closeFileModal();
  };

  const handleInsertImage = (imageUrl) => {
    setBody(body + `<img src="${imageUrl}" style="width:100%;height:auto;" alt="Image insérée" />`);
    closeGalleryModal();
  };

  const openCoverImageModal = () => setIsCoverImageModalOpen(true);
  const closeCoverImageModal = () => setIsCoverImageModalOpen(false);
  const openImagePreview = () => setIsImagePreviewOpen(true);
  const closeImagePreview = () => setIsImagePreviewOpen(false);
  const openGalleryModal = () => setIsGalleryOpen(true);
  const closeGalleryModal = () => setIsGalleryOpen(false);
  const openFileModal = () => setIsFileModalOpen(true);
  const closeFileModal = () => setIsFileModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ id: post.id, title, body, coverImage });
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl h-[80vh] overflow-y-auto shadow-lg">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Modifier l'article</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                Titre de l'article
              </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Titre du post"
              required
            />

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
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                Contenu de l'article
              </label>
            <FroalaEditor
              model={body}
              onModelChange={setBody}
              config={{
                height: 300,
                pluginsEnabled: [
                  "image", "file", "link", "table", "lists",
                  "paragraphFormat", "align", "fontFamily", "fontSize",
                  "colors", "quote", "video"
                ],
                toolbarButtons: [
                  "bold", "italic", "underline", "strikeThrough",
                  "subscript", "superscript", "fontFamily", "fontSize",
                  "color", "inlineStyle", "paragraphStyle",
                  "align", "formatOL", "formatUL", "outdent",
                  "indent", "quote", "insertLink", "insertImage",
                  "insertVideo", "insertFile", "insertTable",
                  "emoticons", "specialCharacters", "insertHR",
                  "clearFormatting", "html", "fullscreen"
                ],
                fileUploadURL: '/api/upload_file',
                fileAllowedTypes: ['application/pdf', 'video/mp4', 'video/webm', 'video/ogg'],
                events: {
                  'file.uploaded': function (response) {
                    const fileData = JSON.parse(response);
                    if (fileData && fileData.link) {
                      const fileWidget = `
                        <div class="file-widget">
                          <iframe src="${fileData.link}" style="width:100%;height:500px;" frameborder="0"></iframe>
                          <p><a href="${fileData.link}" target="_blank" style="color:blue;">${fileData.link.split('/').pop()}</a></p>
                        </div>`;
                      this.html.insert(fileWidget);
                    } else {
                      console.error('File upload failed: No link returned');
                    }
                  },
                  'file.error': function (error) {
                    console.error('Error uploading file:', error);
                  },
                },
              }}
            />

            <div className="flex gap-4 mt-4">
              <button
                type="button"
                className="flex-1 justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={openGalleryModal}
              >
                Insérer une image existante
              </button>
              <button
                type="button"
                className="flex-1 justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={openFileModal}
              >
                Insérer un fichier existant
              </button>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal pour la galerie d'images */}
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
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" onScroll={handleScroll}>
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

      {/* Modal pour la prévisualisation de l'image de couverture */}
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

      {/* Modal pour choisir l'image de couverture */}
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
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" onScroll={handleScroll}>
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

      {/* Modal pour insérer un fichier existant */}
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
                  <div className="max-h-40 overflow-y-auto" onScroll={handleScroll}>
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
                                onClick={() => handleInsertFile(`/files/${file.name}`)}
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
    </>
  );
};

export default UpdatePost;
