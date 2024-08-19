import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Action Verticale",
  description: "Escalade Club à la rivière",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-white  text-zinc-900 flex flex-row h-screen justify-between  min-h-screen`}
      >
        <aside className="w-64 h-screen bg-zinc-100 p-4 flex flex-col justify-between">
          <nav>
            <ul>
              <li>
                <Link href="/dashboard">Tableau de Bord</Link>
              </li>
              <li>
                <Link href="/dashboard/create-post">Créé un article</Link>
              </li>
              <li>
                <Link href="/dashboard/galery">Gallerie</Link>
              </li>
            </ul>
          </nav>
          <footer>
            <p>&copy; 2023 Action Verticale</p>
          </footer>
        </aside>
        <main className=" flex-1 text-center pt-16">{children}</main>
      </body>
    </html>
  );
}
