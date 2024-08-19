import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
        className={`${inter.className} bg-white  text-zinc-900 flex justify-between flex-col min-h-screen h-fit`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
