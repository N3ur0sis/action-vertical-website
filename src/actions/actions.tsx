"use server";

import prisma from "@/libs/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData, model: string) {
  const { isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }
  const title = formData.get("title") as string;
  const body = model;

  await prisma.post.create({
    data: {
      title,
      body,
    },
  });

  revalidatePath("/posts ");
}
