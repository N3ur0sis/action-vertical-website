import React from 'react';
import { FiEdit, FiTrash, FiCheck, FiArrowRightCircle } from 'react-icons/fi';

const PostsTable = ({ posts, onEdit, onDelete, selectedPosts, toggleSelection, isSelectionMode }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Titre</th>
            <th scope="col" className="px-6 py-3">Date d'ajout</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center">
                Aucun post à afficher
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr
                key={post.id}
                className={`border-b cursor-pointer ${selectedPosts.includes(post.id) ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => isSelectionMode && toggleSelection(post.id)}
              >
                <td
                  className="px-6 py-4 font-medium text-gray-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelectionMode) {
                      window.open(`/posts/${post.id}`, '_blank');
                    }
                  }}
                >
                  {post.title}
                </td>
                <td className="px-6 py-4">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex space-x-4 items-center">
                  {isSelectionMode ? (
                    selectedPosts.includes(post.id) && (
                      <FiCheck className="text-green-600 cursor-pointer w-6 h-6" />
                    )
                  ) : (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); onEdit(post); }}>
                        <FiEdit className="text-blue-600 cursor-pointer w-6 h-6" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}>
                        <FiTrash className="text-red-600 cursor-pointer w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/posts/${post.id}`, '_blank');
                        }}
                      >
                        <FiArrowRightCircle className="text-gray-600 cursor-pointer w-6 h-6" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PostsTable;
