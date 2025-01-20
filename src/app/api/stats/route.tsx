import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    // Count the number of posts
    const totalPosts = await prisma.post.count();

    // List files from the "files/" directory in Vercel Blob
    const filesList = await list({ prefix: "files/" });
    const totalFiles = filesList.blobs.length;

    // List images from the "uploads/" directory in Vercel Blob
    const imagesList = await list({ prefix: "uploads/" });
    const totalImages = imagesList.blobs.length;

    return NextResponse.json({
      totalPosts,
      totalFiles,
      totalImages,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}