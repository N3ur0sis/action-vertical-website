import { NextResponse } from "next/server";
import prisma from "@/libs/db";

export async function GET() {
  try {
    const recentPosts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5, // Limite à 5 posts
    });

    return NextResponse.json({
      posts: recentPosts.map((post) => ({
        id: post.id,
        title: post.title,
        date: post.createdAt,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch recent posts:", error);
    return NextResponse.json({ error: "Failed to fetch recent posts" }, { status: 500 });
  }
}
