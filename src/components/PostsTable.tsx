import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiEdit, FiTrash, FiCheck, FiArrowRightCircle, FiEye, FiEyeOff } from 'react-icons/fi'

export default function PostsTable({
  posts,
  onEdit,
  onDelete,
  selectedPosts,
  toggleSelection,
  isSelectionMode,
  onPublish
}) {
  const [sortedPosts, setSortedPosts] = useState([])

  useEffect(() => {
    const sorted = [...posts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    setSortedPosts(sorted)
  }, [posts])

  const handlePublishToggle = async (postId, currentStatus) => {
    try {
      const response = await fetch(`/api/post-draft`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId, isPublished: !currentStatus }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to toggle publish status')
      }
  
      const updatedPost = await response.json()
  
      // Met à jour dynamiquement l'état des posts dans le composant
      setSortedPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      )
    } catch (error) {
      console.error('Error toggling publish status:', error)
      // Tu peux ajouter une notification d'erreur ici pour l'utilisateur
    }
  }
  

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table  className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dernière mise à jour
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedPosts.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                Aucun post à afficher
              </td>
            </tr>
          ) : (
            sortedPosts.map((post) => (
              <motion.tr
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`cursor-pointer ${
                  selectedPosts.includes(post.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => isSelectionMode && toggleSelection(post.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm font-medium text-gray-900"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!isSelectionMode) {
                        window.open(`/posts/${post.id}`, '_blank')
                      }
                    }}
                  >
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(post.updatedAt).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.isPublished ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {isSelectionMode ? (
                    selectedPosts.includes(post.id) && (
                      <FiCheck className="text-green-600 w-5 h-5" />
                    )
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(post); }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`/posts/${post.id}`, '_blank')
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiArrowRightCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePublishToggle(post.id, post.isPublished)
                        }}
                        className={`${post.isPublished ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`}
                      >
                        {post.isPublished ? <FiEye className="w-5 h-5" /> : <FiEyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}