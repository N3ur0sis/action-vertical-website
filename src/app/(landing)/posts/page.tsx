import PostsList from "@/components/posts-list";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {
  return (
    <main className="pt-16 px-5">
      <h1 className="text-center text-gray-800 text-4xl md:text-4l mb-5 uppercase font-bold">Tous les articles</h1>
        <PostsList />
    </main>
  );
}
