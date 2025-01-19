'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import dynamic from 'next/dynamic'
import Editor from './post-editor/Editor'
import CoverImageUploader from './post-editor/CoverImageUploader'
import Alert from './alert'
import { createPost } from '@/actions/actions'

// Dynamic imports with Suspense fallback
const ImageGalleryModal = dynamic(() => import('./post-editor/ImageGalleryModal'), { ssr: false })
const FileModal = dynamic(() => import('./post-editor/FileModal'), { ssr: false })
const InsertGalleryModal = dynamic(() => import('./post-editor/InsertGalleryModal'), { ssr: false })
const ImagePreviewModal = dynamic(() => import('./post-editor/ImagePreviewModal'), { ssr: false })

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
    setTimeout(() => setAlert({ type: '', message: '', isVisible: false }), 3000)
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/all-images`)
      if (res.ok) {
        const data = await res.json()
        setImages(data.images || [])
      } else {
        showAlert('error', 'Failed to load images.')
      }
    } catch {
      showAlert('error', 'An error occurred while fetching images.')
    }
  }, [showAlert])

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/files`)
      if (res.ok) {
        const data = await res.json()
        setFiles(data.files || [])
      } else {
        console.error('Failed to fetch files.')
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }, [])

  const handleSubmit = useCallback(async (isPublished) => {
    if (!title) {
      showAlert('error', 'Title is required to publish the article.')
      return
    }
    try {
      await createPost({ title, content: model, coverImage, isPublished })
      showAlert('success', `Article ${isPublished ? 'published' : 'saved as draft'} successfully!`)
      setTitle('')
      setModel('')
      setCoverImage('/bg.jpeg')
    } catch {
      showAlert('error', 'Error while publishing the article.')
    }
  }, [title, model, coverImage, showAlert])

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <motion.main
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Create New Article</h2>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <CoverImageUploader coverImage={coverImage} setCoverImage={setCoverImage} />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Editor model={model} setModel={setModel} />
          </motion.div>

          <div className="flex gap-4">
            <motion.button
              onClick={() => { fetchImages(); setIsGalleryOpen(true) }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Insert Image
            </motion.button>
            <motion.button
              onClick={() => { fetchFiles(); setIsFileModalOpen(true) }}
              className="bg-orange-600 text-white px-4 py-2 rounded"
            >
              Insert File or Video
            </motion.button>
            <motion.button
              onClick={() => { fetchImages(); setIsInsertGalleryModalOpen(true) }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Insert Gallery
            </motion.button>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => handleSubmit(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Publish
            </button>
          </div>
        </form>
      </motion.div>

      <Suspense fallback={<div>Loading...</div>}>
        <ImageGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={images}
          handleInsertImage={handleInsertImage}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <FileModal
          isOpen={isFileModalOpen}
          onClose={() => setIsFileModalOpen(false)}
          files={files}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleInsertMedia={handleInsertMedia}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <InsertGalleryModal
          isOpen={isInsertGalleryModalOpen}
          onClose={() => setIsInsertGalleryModalOpen(false)}
          onInsert={handleInsertGallery}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <ImagePreviewModal
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
          imageUrl={coverImage}
        />
      </Suspense>
    </motion.main>
  )
}