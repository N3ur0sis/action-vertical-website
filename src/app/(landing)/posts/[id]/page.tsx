import Post from "@/components/post";
import { Suspense } from "react";

export default function Page({ params }) {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-300 rounded mb-4"></div>
              <div className="w-full h-64 sm:h-96 bg-gray-300 rounded-lg mb-6"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        }
      >
        <Post params={params} />
      </Suspense>
    </main>
  );
}
