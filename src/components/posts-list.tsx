'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Alert from "@/components/alert";

// Composant SkeletonCard pour le chargement
function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col animate-pulse">
      <div className="h-56 w-full bg-gray-300"></div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="h-10 bg-blue-300 rounded mt-4"></div>
      </div>
    </div>
  );
}

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '', isVisible: false });

  // Fonction pour charger les posts
  const loadPosts = async () => {
    try {
      const res = await fetch(`/api/posts?page=${page}&limit=6`);
      if (!res.ok) {
        throw new Error(`Erreur lors du chargement des articles : ${res.statusText}`);
      }
      const newPosts = await res.json();

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => {
          const postIds = prevPosts.map(post => post.id);
          const filteredPosts = newPosts.filter(post => !postIds.includes(post.id));
          return [...prevPosts, ...filteredPosts];
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des articles :", error);
      setAlert({ type: 'error', message: "Erreur lors du chargement des articles.", isVisible: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
        return;
      }
      setPage(prevPage => prevPage + 1);
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);
  

  const truncateHTML = (html, maxLength) => {
    const tempDiv = typeof window !== "undefined" ? document.createElement("div") : null;
    if (tempDiv) {
      tempDiv.innerHTML = html;
      const text = tempDiv.textContent || tempDiv.innerText || "";
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    return html.length > maxLength ? html.substring(0, maxLength) + '...' : html;
  };

  return (
    <div className="container mx-auto py-8">
      {alert.isVisible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: '', message: '', isVisible: false })}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <Link href={`/posts/${post.id}`}>
              <img 
                className="h-56 w-full object-cover" 
                src={post.coverImage || "/parallax.jpeg"} 
                alt={post.title} 
                style={{ objectFit: 'cover' }}
              />
            </Link>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h5 className="text-xl font-bold text-gray-900 mb-2" dangerouslySetInnerHTML={{ __html: truncateHTML(post.title, 50) }}></h5>
                <p className="text-xs text-gray-500 mb-2">Publié le {new Date(post.updatedAt).toLocaleDateString('fr-FR')}</p>
                <div className="text-sm text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: truncateHTML(post.body, 250) }}></div>
              </div>
              <Link href={`/posts/${post.id}`} className="inline-flex items-center px-5 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-auto">
                Lire plus
                <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10" aria-hidden="true">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </Link>
              <div className="flex items-center mt-4">
                <Image
                  src="/logo.jpeg"
                  alt="Action Verticale Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="ml-2 text-sm text-gray-700">Action Verticale</span>
              </div>
            </div>
          </div>
        ))}
        {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      {!hasMore && !loading && <p className="text-center text-gray-500 mt-8">Plus d'articles à charger</p>}
    </div>
  );
}
