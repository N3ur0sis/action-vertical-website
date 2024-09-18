"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Pages fixes qui ne peuvent pas être modifiées ou supprimées
const fixedPages = [
  { title: "ACCUEIL", route: "/" },
  { title: "ACTUALITÉS", route: "/posts" },
];

export default function Header() {
  const [scrolling, setScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathName = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/navbar");
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const renderMenuItems = (items, isChild = false) => {
    return items
      .filter(item => item.isActive && (item.parentId === null || isChild))
      .map((item) => {
        if (item.type === "MENU" && item.children && item.children.length > 0) {
          return (
            <div key={item.title} className="relative group">
              <button className="py-2 px-4 text-gray-700 hover:text-gray-500 flex items-center">
                {item.title}
                <svg
                  className="w-2.5 h-2.5 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1l4 4 4-4"
                  />
                </svg>
              </button>
              <div className="absolute left-0 top-full mt-0 bg-white shadow-md rounded-lg text-sm py-2 space-y-1 w-48 hidden group-hover:block">
                {renderMenuItems(item.children, true)}
              </div>
            </div>
          );
        } else {
          return (
            <Link
              key={item.title}
              href={item.route}
              target={item.type === "EXTERNAL_LINK" ? "_blank" : "_self"}
              className={`block py-2 px-4 text-gray-700 hover:text-gray-500 ${
                pathName === item.route ? "text-gray-500" : ""
              }`}
            >
              <span>{item.title}</span>
            </Link>
          );
        }
      });
  };

  return (
    <>
      <div className="pt-20"></div>
      <nav
        className={`fixed w-full z-20 top-0 left-0 border-b border-gray-200 transition-all ${
          scrolling
            ? "bg-white backdrop-blur-md py-3 shadow-md"
            : "bg-white py-5"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-black leading-tight"
          >
            ACTION
            <br />
            VERTICALE
          </Link>

          <button
            type="button"
            className="lg:hidden p-2 w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          <div className="hidden lg:flex lg:flex-row lg:space-x-4 font-medium text-sm">
            {fixedPages.map((item) => (
              <Link
                key={item.title}
                href={item.route}
                className={`block py-2 px-4 text-gray-700 hover:text-gray-500 ${
                  pathName === item.route ? "text-gray-500" : ""
                }`}
              >
                <span>{item.title}</span>
              </Link>
            ))}
            {renderMenuItems(menuItems)}
          </div>

          <Link
            href="/contact"
            className="hidden lg:block text-white bg-blue-400 hover:bg-blue-500 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Contact
          </Link>
        </div>
      </nav>

      <div
        className={`lg:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-40 transform transition-transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <button
            type="button"
            className="p-2 w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 fixed top-4 right-4"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <ul className="mt-4 space-y-4 p-4">
          {fixedPages.map((item) => (
            <li key={item.title}>
              <Link
                href={item.route}
                className="block py-2 text-gray-700 hover:text-gray-500"
              >
                {item.title}
              </Link>
            </li>
          ))}
          {menuItems
            .filter(item => item.isActive && item.parentId === null)
            .map((item, index) =>
              item.type === "MENU" ? (
                <li key={item.title} className="relative">
                  <button
                    className="w-full text-left py-2 text-gray-700 hover:text-gray-500 flex items-center justify-between"
                    onClick={() => toggleDropdown(index)}
                  >
                    {item.title}
                    <svg
                      className="w-4 h-4 ml-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </button>
                  <ul
                    className={`pl-4 mt-2 space-y-2 border-l border-gray-200 ${
                      activeDropdown === index ? "block" : "hidden"
                    }`}
                  >
                    {renderMenuItems(item.children, true)}
                  </ul>
                </li>
              ) : (
                <li key={item.title}>
                  <Link
                    href={item.route}
                    className="block py-2 text-gray-700 hover:text-gray-500"
                  >
                    {item.title}
                  </Link>
                </li>
              )
            )}
          <li>
            <Link
              href="/contact"
              className="block text-white bg-blue-400 hover:bg-blue-500 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
