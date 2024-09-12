"use server";

import prisma from "@/libs/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost({
  title,
  content,
  coverImage = "/bg.jpeg",
  isPublished = false,  // Nouveau paramètre pour définir l'état de publication
}: {
  title: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
}) {
  const session = await getKindeServerSession();
  if (!(await session.isAuthenticated())) {
    redirect("/api/auth/login");
  }

  await prisma.post.create({
    data: {
      title,
      body: content,
      coverImage,
      isPublished,  // Enregistre l'état de publication
    },
  });

  revalidatePath("/posts");
}
