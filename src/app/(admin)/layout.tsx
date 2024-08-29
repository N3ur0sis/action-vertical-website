'use client';

import "../globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/sidebar";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-zinc-900 flex`}>
        <Sidebar />
        <main className="flex-1 p-4 sm:ml-64">
          <div className="pt-16">{children}</div>
        </main>
      </body>
    </html>
  );
}
