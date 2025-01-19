"use client";

import { useEffect, useState } from "react";
import { FaFileAlt, FaClipboardList, FaImage, FaList, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface MenuItem {
  id: number;
  title: string;
  route: string | null;
  type: string;
  children?: MenuItem[];
}

interface MenuData {
  menuItems: MenuItem[];
  pageCount: number;
}

export default function DashboardContent() {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [pagesInMenus, setPagesInMenus] = useState<Set<number>>(new Set());
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("${process.env.NEXT_PUBLIC_VERCEL_URL}/api/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoadingStats(false);
      }
    }

    async function fetchRecentPosts() {
      try {
        const response = await fetch("${process.env.NEXT_PUBLIC_VERCEL_URL}/api/recent-posts");
        const data = await response.json();
        setRecentPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch recent posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    }

    async function fetchMenuData() {
      try {
        const response = await fetch("${process.env.NEXT_PUBLIC_VERCEL_URL}/api/menu");
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
      } finally {
        setLoadingMenu(false);
      }
    }

    fetchStats();
    fetchRecentPosts();
    fetchMenuData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8 "
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        className="text-4xl font-bold mb-8 text-gray-800"
      >
        Tableau de bord
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {loadingStats || !stats || !menuData ? (
          <>
            <SkeletonWidget />
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
              color="bg-blue-400"
            />
            <Widget
              icon={<FaFileAlt size={24} />}
              count={stats.totalFiles}
              label="Total des fichiers"
              color="bg-green-400"
            />
            <Widget
              icon={<FaImage size={24} />}
              count={stats.totalImages}
              label="Total des images"
              color="bg-yellow-400"
            />
            <Widget
              icon={<FaList size={24} />}
              count={menuData.pageCount}
              label="Nombre de pages"
              color="bg-purple-400"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Articles récents</h2>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {loadingPosts ? (
              <SkeletonTable />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentPosts.map((post, index) => (
                      <motion.tr
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <td className="py-4 px-4 whitespace-nowrap">{post.title}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {new Date(post.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            onClick={() => router.push(`/dashboard/posts/`)}
                          >
                            Modifier
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Menu du site</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            {loadingMenu || !menuData ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <nav>
                <ul className="space-y-2">
                  {menuData.menuItems.map((item) => (
                    <MenuItemComponent 
                      key={item.id} 
                      item={item} 
                      pagesInMenus={pagesInMenus}
                      setPagesInMenus={setPagesInMenus}
                    />
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionButton
          label="Créer un nouvel article"
          color="bg-blue-400"
          icon={<FaClipboardList />}
          onClick={() => router.push("/dashboard/create-post")}
        />
        <ActionButton
          label="Voir tous les fichiers"
          color="bg-green-400"
          icon={<FaFileAlt />}
          onClick={() => router.push("/dashboard/files")}
        />
        <ActionButton
          label="Voir toutes les images"
          color="bg-yellow-400"
          icon={<FaImage />}
          onClick={() => router.push("/dashboard/gallery")}
        />
        <ActionButton
          label="Voir tous les articles"
          color="bg-purple-400"
          icon={<FaList />}
          onClick={() => router.push("/dashboard/posts")}
        />
      </div>
    </motion.div>
  );
}

function MenuItemComponent({ item, depth = 0, pagesInMenus, setPagesInMenus }: { 
  item: MenuItem; 
  depth?: number; 
  pagesInMenus: Set<number>;
  setPagesInMenus: React.Dispatch<React.SetStateAction<Set<number>>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;
  const isMenu = item.type === 'MENU';

  useEffect(() => {
    if (isMenu && hasChildren) {
      item.children.forEach(child => {
        if (child.type !== 'MENU') {
          setPagesInMenus(prev => new Set(prev).add(child.id));
        }
      });
    }
  }, [isMenu, hasChildren, item.children, setPagesInMenus]);

  if (!isMenu && depth === 0 && !pagesInMenus.has(item.id)) {
    return (
      <li className="py-1">
        <Link href={item.route || '#'} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
          {item.title}
        </Link>
      </li>
    );
  }

  if (!isMenu && depth === 0) {
    return null;
  }

  return (
    <li className="py-1">
      <div className="flex items-center">
        {isMenu && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mr-2 text-gray-500 hover:text-gray-700"
          >
            {isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
          </button>
        )}
        {isMenu ? (
          <span className="font-semibold">{item.title}</span>
        ) : (
          <Link href={item.route || '#'} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            {item.title}
          </Link>
        )}
      </div>
      {hasChildren && isOpen && (
        <ul className="ml-4 mt-2 space-y-2">
          {item.children.map((child) => (
            <MenuItemComponent 
              key={child.id} 
              item={child} 
              depth={depth + 1} 
              pagesInMenus={pagesInMenus}
              setPagesInMenus={setPagesInMenus}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function Widget({ icon, count, label, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-6 rounded-lg shadow-lg ${color} text-white`}
    >
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-white bg-opacity-30">
          {icon}
        </div>
        <div className="ml-4">
          <h2 className="text-3xl font-bold">{count}</h2>
          <p className="text-sm opacity-80">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonWidget() {
  return (
    <div className="p-6 rounded-lg shadow-lg bg-gray-200 animate-pulse">
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
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="flex items-center space-x-4 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="h-4 bg-gray-300 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

function ActionButton({ label, color, icon, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-full ${color} text-white py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}