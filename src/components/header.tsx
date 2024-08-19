"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Dropdown from "./dropdown";

export interface MenuItem {
  title: string;
  route?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "ACCUEIL",
    route: "/",
  },
  {
    title: "ACTUALITÉS",
    route: "/posts",
  },
  {
    title: "CLUB",
    children: [
      {
        title: "À Propos",
        route: "/club/about",
      },
      {
        title: "Statuts",
        route: "/statuts-action-verticale.pdf",
      },
      {
        title: "Structure",
        route: "/club/sae",
      },
      {
        title: "Règlement Intérieur",
        route: "/club/rules",
      },
    ],
  },
  {
    title: "COURS",
    children: [
      {
        title: "Ecole Escalade",
        route: "/class/escalade",
      },
      {
        title: "Horaires",
        route: "/class/horaires",
      },
      {
        title: "Inscriptions",
        route: "/class/inscription",
      },
    ],
  },
  {
    title: "FORMATION",
    children: [
      {
        title: "Passeport",
        route: "/formation/passeport",
      },
      {
        title: "Ligue",
        route: "/formation/ligue",
      },
    ],
  },
  {
    title: "CONTACT",
    route: "/contact",
  },
  {
    title: "SHOP",
    route: "/shop",
  },
];

export default function Header() {
  const pathName = usePathname();
  return (
    <div className=" backdrop-blur-2xl bg-white/30 sticky top-0 z-50 ">
      <header className="flex items-center py-2 px-10 ">
        <Link href="/" className="flex-initial">
          <p className="text-[20px] font-bold">
            ACTION <br /> VERTCIALE
          </p>
        </Link>
        <nav className="absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex items-center gap-x-5 text-[20px] font-bold pt-2">
            {menuItems.map((item) => {
              return item.hasOwnProperty("children") ? (
                <Dropdown item={item} />
              ) : (
                <Link
                  className={` ${
                    pathName == item.route
                      ? "text-blue-400"
                      : "hover:text-blue-400"
                  } `}
                  href={item?.route || ""}
                >
                  {item.title}
                </Link>
              );
            })}
          </ul>
        </nav>
      </header>
    </div>
  );
}
