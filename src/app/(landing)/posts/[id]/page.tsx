import Post from "@/components/post";
import { Suspense } from "react";

export default function Page({ params }) {
  return (
    <main className="px-7 pt-24 text-center">
      <Suspense fallback="Loading...">
        <Post params={params} />
      </Suspense>
    </main>
  );
}
