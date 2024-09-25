'use client';

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiGrid, FiFileText, FiImage, FiFile, FiFilePlus, FiLogOut, FiSettings } from "react-icons/fi";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const navItems = [
  { path: "/dashboard", icon: FiGrid, label: "Tableau de Bord" },
  { path: "/dashboard/create-post", icon: FiFilePlus, label: "Créer un Article" },
  { path: "/dashboard/gallery", icon: FiImage, label: "Gestion des Images" },
  { path: "/dashboard/posts", icon: FiFileText, label: "Tous les Articles" },
  { path: "/dashboard/files", icon: FiFile, label: "Gestion des Fichiers" },
  { path: "/dashboard/navbar-manager", icon: FiSettings, label: "Gestion du Navbar" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-gray-800 p-4 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <Link href="/" legacyBehavior>
              <a className="flex items-center mb-8">
                <span className="text-2xl font-semibold text-white leading-tight">
                  ACTION<br />VERTICALE
                </span>
              </a>
            </Link>
            <nav>
              <ul className="space-y-3 font-medium">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path} legacyBehavior>
                      <a
                        className={`w-full flex items-center p-2 text-white rounded-lg transition-colors ${
                          pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
                        }`}
                      >
                        <item.icon className="w-5 h-5 text-white" />
                        <span className="ml-3">{item.label}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <LogoutLink className="w-full">
            <button className="w-full flex items-center p-2 text-white rounded-lg hover:bg-red-700 bg-red-600 mt-4 transition-colors">
              <FiLogOut className="w-5 h-5 text-white" />
              <span className="ml-3">Déconnexion</span>
            </button>
          </LogoutLink>
        </div>
      </aside>

      {!isOpen && (
        <button
          className="fixed top-1/2 left-2 z-40 w-12 h-12 bg-gray-800 text-white rounded-full -translate-y-1/2 cursor-pointer flex items-center justify-center sm:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiMenu className="text-white w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden" onClick={() => setIsOpen(false)} />
      )}

      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {/* Contenu chargé dynamiquement ici */}
      </Suspense>
    </>
  );
}
