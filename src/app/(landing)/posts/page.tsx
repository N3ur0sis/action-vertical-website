import PostsList from "@/components/posts-list";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {
  return (
    <main className="text-center pt-16 px-5">
      <h1 className="font-bold text-4xl md:text-5xl mb-5">Tous les articles</h1>
      <Suspense fallback="Loading...">
        <PostsList />
      </Suspense>
    </main>
  );
}
