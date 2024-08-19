import prisma from "@/libs/db";
import { notFound } from "next/navigation";

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
    <main className="px-7 pt-24 text-center">
      <h1 className="font-semibold text-5xl mb-7">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
    </main>
  );
}
