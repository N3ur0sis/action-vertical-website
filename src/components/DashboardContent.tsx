"use client";

import { useEffect, useState } from "react";
import { FaFileAlt, FaClipboardList, FaImage } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function DashboardContent() {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
      setLoadingStats(false);
    }

    async function fetchRecentPosts() {
      const response = await fetch("/api/recent-posts");
      const data = await response.json();
      setRecentPosts(data.posts);
      setLoadingPosts(false);
    }

    fetchStats();
    fetchRecentPosts();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-semibold mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {loadingStats ? (
          <>
            <SkeletonWidget />
            <SkeletonWidget />
            <SkeletonWidget />
          </>
        ) : (
          <>
            <Widget
              icon={<FaClipboardList size={24} />}
              count={stats.totalPosts}
              label="Total des articles"
              color="bg-blue-100"
            />
            <Widget
              icon={<FaFileAlt size={24} />}
              count={stats.totalFiles}
              label="Total des fichiers"
              color="bg-yellow-100"
            />
            <Widget
              icon={<FaImage size={24} />}
              count={stats.totalImages}
              label="Total des images"
              color="bg-purple-100"
            />
          </>
        )}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Articles récents</h2>
        <div className="bg-white shadow rounded-lg p-6">
          {loadingPosts ? (
            <SkeletonTable />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Titre</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="py-2 px-4 border-b">{post.title}</td>
                      <td className="py-2 px-4 border-b">
                        {new Date(post.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => router.push(`/dashboard/posts`)}
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionButton
          label="Créer un nouvel article"
          color="bg-blue-500"
          onClick={() => router.push("/dashboard/create-post")}
        />
        <ActionButton
          label="Voir tous les fichiers"
          color="bg-yellow-500"
          onClick={() => router.push("/dashboard/files")}
        />
        <ActionButton
          label="Voir toutes les images"
          color="bg-purple-500"
          onClick={() => router.push("/dashboard/gallery")}
        />
        <ActionButton
          label="Voir tous les articles"
          color="bg-green-500"
          onClick={() => router.push("/dashboard/posts")}
        />
      </div>
    </div>
  );
}

function Widget({ icon, count, label, color }) {
  return (
    <div className={`p-6 rounded-lg shadow ${color}`}>
      <div className="flex items-center">
        <div className="p-3 rounded-full text-gray-600 bg-white shadow">
          {icon}
        </div>
        <div className="ml-4">
          <h2 className="text-3xl font-bold text-gray-800">{count}</h2>
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}

function SkeletonWidget() {
  return (
    <div className="p-6 rounded-lg shadow bg-gray-200 animate-pulse">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-gray-300 shadow" />
        <div className="ml-4 w-full">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-300 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
          <div className="w-full">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionButton({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full ${color} text-white py-3 px-4 rounded hover:opacity-90 transition`}
    >
      {label}
    </button>
  );
}
