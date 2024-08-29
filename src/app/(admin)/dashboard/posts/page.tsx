"use client";

import React, { useState, useEffect, Fragment } from "react";
import { FiTrash, FiEdit, FiCheck, FiX, FiPlus } from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import UpdatePost from "@/components/UpdatePost";
import PostsTable from "@/components/PostsTable";
import Alert from "@/components/alert";

const AdminPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({ type: '', message: '', isVisible: false });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts(1); // Réinitialise les posts lors de la modification de la recherche
  }, [searchQuery]);

  useEffect(() => {
    fetchPosts(page); // Charge les posts lors du défilement
  }, [page]);

  const fetchPosts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin-posts?page=${pageNumber}&limit=10&search=${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        if (pageNumber === 1) {
          setPosts(data.posts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        }
        setHasMore(data.posts.length > 0); // Détermine s'il y a d'autres pages disponibles
      } else {
        throw new Error("Échec du chargement des posts");
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      showAlert('warning', 'Échec du chargement des posts');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message, isVisible: true });
    setTimeout(() => {
      setAlert({ type: '', message: '', isVisible: false });
    }, 3000);
  };

  const updatePost = async (updatedPost) => {
    try {
      const res = await fetch("/api/admin-posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });

      if (!res.ok) {
        throw new Error("Échec de la mise à jour du post");
      }

      showAlert('success', 'Post mis à jour avec succès');
      setIsModalOpen(false);
      fetchPosts(1);
    } catch (error) {
      console.error("Failed to update post:", error);
      showAlert('warning', 'Échec de la mise à jour du post');
    }
  };

  const deletePosts = async () => {
    try {
      const res = await fetch("/api/admin-posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedPosts }),
      });

      if (!res.ok) {
        throw new Error("Échec de la suppression des posts");
      }

      showAlert('success', 'Post(s) supprimé(s) avec succès');
      setIsDeleteModalOpen(false);
      exitSelectionMode();
      fetchPosts(1);
    } catch (error) {
      console.error("Failed to delete posts:", error);
      showAlert('warning', 'Échec de la suppression des posts');
    }
  };

  const toggleSelection = (postId) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter((id) => id !== postId));
    } else {
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  const handleEditClick = (post) => {
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (postId) => {
    setIsSelectionMode(true);
    toggleSelection(postId);
  };

  useEffect(() => {
    if (selectedPosts.length === 0) {
      setIsSelectionMode(false);
    }
  }, [selectedPosts]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedPosts([]);
  };

  return (
    <div className="p-8 bg-white">
      {alert.isVisible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: '', message: '', isVisible: false })}
        />
      )}
      <h1 className="text-2xl font-bold mb-6">Gestion des posts</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Rechercher un post..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"
            onClick={() => window.location.href = "/dashboard/create-post"}
          >
            <FiPlus className="w-5 h-5" />
            <span>Ajouter un post</span>
          </button>
        </div>
      </div>
      {loading && page === 1 ? (
        <div className="space-y-4">
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
      ) : (
        <PostsTable
          posts={filteredPosts}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          selectedPosts={selectedPosts}
          toggleSelection={toggleSelection}
          isSelectionMode={isSelectionMode}
        />
      )}

      {loading && page > 1 && (
        <div className="space-y-4 mt-4">
          {[...Array(3)].map((_, idx) => (
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
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Supprimer les posts sélectionnés
          </button>
        </div>
      )}

      <UpdatePost
        post={currentPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={updatePost}
      />

      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Confirmer la suppression
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer le(s) post(s) sélectionné(s) ? Cette action est irréversible.
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
                    onClick={deletePosts}
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

export default AdminPostsPage;
