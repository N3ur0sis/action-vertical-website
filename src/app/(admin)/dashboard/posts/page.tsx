'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiX } from 'react-icons/fi'
import UpdatePost from '@/components/UpdatePost'
import PostsTable from '@/components/PostsTable'
import Alert from '@/components/alert'

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPosts, setSelectedPosts] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [alert, setAlert] = useState({ type: '', message: '', isVisible: false })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = useCallback(async (pageNumber = 1) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin-posts?page=${pageNumber}&limit=10&search=${searchQuery}`)
      if (res.ok) {
        const data = await res.json()
        if (pageNumber === 1) {
          setPosts(data.posts)
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data.posts])
        }
        setHasMore(data.posts.length > 0)
      } else {
        throw new Error("Échec du chargement des posts")
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
      showAlert('warning', 'Échec du chargement des posts')
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message, isVisible: true })
    setTimeout(() => {
      setAlert({ type: '', message: '', isVisible: false })
    }, 3000)
  }, [])

  const updatePost = useCallback(async (updatedPost) => {
    try {
      const res = await fetch("/api/admin-posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      })

      if (!res.ok) {
        throw new Error("Échec de la mise à jour du post")
      }

      showAlert('success', 'Post mis à jour avec succès')
      setIsModalOpen(false)
      fetchPosts(1)
    } catch (error) {
      console.error("Failed to update post:", error)
      showAlert('warning', 'Échec de la mise à jour du post')
    }
  }, [fetchPosts, showAlert])

  const deletePosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin-posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedPosts }),
      })

      if (!res.ok) {
        throw new Error("Échec de la suppression des posts")
      }

      showAlert('success', 'Post(s) supprimé(s) avec succès')
      setIsDeleteModalOpen(false)
      exitSelectionMode()
      fetchPosts(1)
    } catch (error) {
      console.error("Failed to delete posts:", error)
      showAlert('warning', 'Échec de la suppression des posts')
    }
  }, [selectedPosts, showAlert, fetchPosts])

  const toggleSelection = useCallback((postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
  }, [])

  const handleEditClick = useCallback((post) => {
    setCurrentPost(post)
    setIsModalOpen(true)
  }, [])

  const handleDeleteClick = useCallback((postId) => {
    setIsSelectionMode(true)
    toggleSelection(postId)
  }, [toggleSelection])

  const handlePublish = useCallback(async (postId, isPublished) => {
    try {
      const res = await fetch("/api/admin-posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: postId, isPublished }),
      })

      if (!res.ok) {
        throw new Error("Échec de la mise à jour du statut du post")
      }

      showAlert('success', `Post ${isPublished ? 'publié' : 'mis en brouillon'} avec succès`)
      fetchPosts(1)
    } catch (error) {
      console.error("Failed to update post status:", error)
      showAlert('warning', 'Échec de la mise à jour du statut du post')
    }
  }, [fetchPosts, showAlert])

  useEffect(() => {
    if (selectedPosts.length === 0) {
      setIsSelectionMode(false)
    }
  }, [selectedPosts])

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
      hasMore &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1)
    }
  }, [hasMore, loading])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const filteredPosts = useMemo(
    () => posts.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [posts, searchQuery]
  )

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false)
    setSelectedPosts([])
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 bg-white"
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
      <h1 className="text-2xl font-bold mb-6">Gestion des posts</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Rechercher un post..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="border border-gray-300 rounded-md px-4 py-2 w-64"
          />
          <button
            onClick={() => window.location.href = "/dashboard/create-post"}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>Ajouter un post</span>
          </button>
        </div>
      </div>
      {loading && page === 1 ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
            >
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <PostsTable
          posts={filteredPosts}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          selectedPosts={selectedPosts}
          toggleSelection={toggleSelection}
          isSelectionMode={isSelectionMode}
          onPublish={handlePublish}
        />
      )}

      {loading && page > 1 && (
        <div className="space-y-4 mt-4">
          {[...Array(3)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
            >
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isSelectionMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 flex items-center space-x-4"
        >
          <button
            onClick={exitSelectionMode}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
          >
            <FiX className="w-5 h-5" />
            <span>Annuler</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Supprimer les posts sélectionnés
          </button>
        </motion.div>
      )}

      <UpdatePost
        post={currentPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={updatePost}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer le(s) post(s) sélectionné(s) ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={deletePosts}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}