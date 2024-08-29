"use server";

import prisma from "@/libs/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost({
  title,
  content,
  coverImage = "/bg.jpeg", // Valeur par défaut
}: {
  title: string;
  content: string;
  coverImage?: string;
}) {
  const session = await getKindeServerSession();
  if (!(await session.isAuthenticated())) {
    redirect("/api/auth/login");
  }

  await prisma.post.create({
    data: {
      title,
      body: content,
      coverImage, // Inclure l'image de couverture
    },
  });

  revalidatePath("/posts");
}
