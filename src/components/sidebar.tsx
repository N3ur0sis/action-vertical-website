import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMenu, FiGrid, FiFileText, FiImage, FiFile, FiFilePlus, FiLogOut } from "react-icons/fi";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNavigation = (path) => {
    setIsLoading(true);
    setIsOpen(false);
    router.push(path);
    setTimeout(() => setIsLoading(false), 500); // simulate loading time
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-gray-800 p-4 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center mb-8">
              <span className="text-2xl font-semibold text-white leading-tight">
                <Link href="/">ACTION<br />VERTICALE</Link>
              </span>
            </div>
            {/* Navigation */}
            <ul className="space-y-3 font-medium">
              <li>
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className="w-full flex items-center p-2 text-white rounded-lg hover:bg-gray-700"
                >
                  <FiGrid className="w-5 h-5 text-white" />
                  <span className="ml-3">Tableau de Bord</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/dashboard/create-post")}
                  className="w-full flex items-center p-2 text-white rounded-lg hover:bg-gray-700"
                >
                  <FiFilePlus className="w-5 h-5 text-white" />
                  <span className="ml-3">Créer un Article</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/dashboard/gallery")}
                  className="w-full flex items-center p-2 text-white rounded-lg hover:bg-gray-700"
                >
                  <FiImage className="w-5 h-5 text-white" />
                  <span className="ml-3">Gestion des Images</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/dashboard/posts")}
                  className="w-full flex items-center p-2 text-white rounded-lg hover:bg-gray-700"
                >
                  <FiFileText className="w-5 h-5 text-white" />
                  <span className="ml-3">Tous les Articles</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/dashboard/files")}
                  className="w-full flex items-center p-2 text-white rounded-lg hover:bg-gray-700"
                >
                  <FiFile className="w-5 h-5 text-white" />
                  <span className="ml-3">Gestion des Fichiers</span>
                </button>
              </li>
            </ul>
          </div>
          <div>
            <LogoutLink>
              <button
                className="w-full flex items-center p-2 text-white rounded-lg hover:bg-red-700 bg-red-600 mt-4"
              >
                <FiLogOut className="w-5 h-5 text-white" />
                <span className="ml-3">Déconnexion</span>
              </button>
            </LogoutLink>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      {!isOpen && (
        <button
          className="fixed top-1/2 left-2 z-40 w-12 h-12 bg-gray-800 text-white rounded-full transform -translate-y-1/2 cursor-pointer flex items-center justify-center sm:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiMenu className="text-white w-6 h-6" />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Loading Animation */}
      {isLoading && (
        <div className="fixed top-0 left-64 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
