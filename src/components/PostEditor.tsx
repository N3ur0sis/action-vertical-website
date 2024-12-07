'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Editor from './post-editor/Editor'
import CoverImageUploader from './post-editor/CoverImageUploader'
import Alert from './alert'
import { createPost } from '@/actions/actions'
import dynamic from 'next/dynamic'

const ImageGalleryModal = dynamic(() => import('./post-editor/ImageGalleryModal'))
const FileModal = dynamic(() => import('./post-editor/FileModal'))
const InsertGalleryModal = dynamic(() => import('./post-editor/InsertGalleryModal'))
const ImagePreviewModal = dynamic(() => import('./post-editor/ImagePreviewModal'))

const SkeletonLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="animate-pulse m-40"
  >
    <div className="h-8 bg-gray-300 rounded mb-6 w-3/4 mx-auto"></div>
    <div className="h-12 bg-gray-300 rounded mb-4"></div>
    <div className="h-10 bg-gray-300 rounded mb-4"></div>
    <div className="h-80 bg-gray-300 rounded mb-4"></div>
    <div className="flex gap-4">
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
    </div>
  </motion.div>
)

export default function PostEditor() {
  const [model, setModel] = useState('')
  const [title, setTitle] = useState('')
  const [coverImage, setCoverImage] = useState('/bg.jpeg')
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [isInsertGalleryModalOpen, setIsInsertGalleryModalOpen] = useState(false)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [images, setImages] = useState([])
  const [files, setFiles] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [alert, setAlert] = useState({ type: '', message: '', isVisible: false })
  const [loading, setLoading] = useState(true)

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message, isVisible: true })
    setTimeout(() => setAlert({ type, message, isVisible: false }), 3000)
  }, [])

  const handleInsertImage = useCallback((imageUrl) => {
    setModel((prevModel) => prevModel + `<img src="${imageUrl}" style="width:100%;height:auto;" alt="Image insérée" />`)
    setIsGalleryOpen(false)
  }, [])

  const handleInsertMedia = useCallback((mediaUrl) => {
    setModel((prevModel) => prevModel + `<iframe src="${mediaUrl}" style="width:100%;height:500px;" frameborder="0"></iframe>`)
    setIsFileModalOpen(false)
  }, [])

  const handleInsertGallery = useCallback((selectedImages) => {
    if (!Array.isArray(selectedImages)) {
      console.error('Selected images are not an array:', selectedImages)
      return
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
          .join('')}
      </div>
    `
    setModel((prevModel) => `${prevModel}${galleryHTML}`)
    setIsInsertGalleryModalOpen(false)
  }, [])

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/all-images')
      if (res.ok) {
        const data = await res.json()
        setImages(data.images)
      } else {
        showAlert('error', 'Échec du chargement des images.')
      }
    } catch (error) {
      showAlert('error', 'Erreur lors du chargement des images.')
    }
  }, [showAlert])

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch(`/api/files`)
      if (res.ok) {
        const data = await res.json()
        setFiles(data.files)
      } else {
        console.error('Failed to load files')
      }
    } catch (error) {
      console.error('Error loading files:', error)
    }
  }, [])

  const handleSubmit = useCallback(async (isPublished) => {
    if (!title) {
      showAlert('error', "Le titre est obligatoire pour publier l'article.")
      return
    }
    try {
      await createPost({
        title,
        content: model,
        coverImage,
        isPublished,
      })
      showAlert('success', `Article ${isPublished ? 'publié' : 'mis en brouillon'} avec succès!`)
      setTitle('')
      setModel('')
      setCoverImage('/bg.jpeg')
    } catch (error) {
      showAlert('error', "Erreur lors de la publication de l'article.")
    }
  }, [title, model, coverImage, showAlert])

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <motion.main
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl p-8"
    >
      <AnimatePresence>
        {alert.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ type: '', message: '', isVisible: false })}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Créer un nouvel article
        </h2>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <CoverImageUploader
              coverImage={coverImage}
              setCoverImage={setCoverImage}
              onClick={() => setIsImagePreviewOpen(true)}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Editor model={model} setModel={setModel} />
          </motion.div>

          <div className="flex gap-4">
            <motion.button
              type="button"
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              onClick={() => {
                fetchImages()
                setIsGalleryOpen(true)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Insérer une image
            </motion.button>
            <motion.button
              type="button"
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
              onClick={() => {
                fetchFiles()
                setIsFileModalOpen(true)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Insérer un fichier ou une vidéo
            </motion.button>
            <motion.button
              type="button"
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              onClick={() => {
                fetchImages()
                setIsInsertGalleryModalOpen(true)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Insérer une galerie
            </motion.button>
          </div>

          <div className="mt-6 flex justify-between">
            <motion.button
              type="button"
              className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none transition duration-150 ease-in-out"
              onClick={() => handleSubmit(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mettre en brouillon
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleSubmit(true)}
              className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Publier
            </motion.button>
          </div>
        </form>
      </motion.div>

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
    </motion.main>
  )
}