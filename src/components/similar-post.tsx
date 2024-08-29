import prisma from "@/libs/db";
import Link from "next/link";
import Image from "next/image";

export default async function SimilarPosts({ currentPostId }) {
  const similarPosts = await prisma.post.findMany({
    where: {
      id: {
        not: currentPostId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return (
    <div className="bg-gray-100 py-12 mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Articles Similaires
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarPosts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                {post.coverImage && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Publié le {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
