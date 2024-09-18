import prisma from "@/libs/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import SimilarPosts from "./similar-post";


export default async function Post({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-white">
      <div className="relative w-full h-96 bg-gray-900">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="opacity-60"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mt-4">
            <Image
              src="/logo.jpeg"
              alt="Action Verticale Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="ml-4 text-lg font-medium text-gray-700">Action Verticale</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Publié le {new Date(post.createdAt).toLocaleDateString('fr-FR')} • Actualité
          </p>
        </div>

        <article
          className="prose prose-lg mx-auto text-center"
          dangerouslySetInnerHTML={{ __html: post.body }}
        ></article>
      </div>

      <SimilarPosts currentPostId={post.id} />
    </main>
  );
}
