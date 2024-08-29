import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Récupération du nombre de posts
    const totalPosts = await prisma.post.count();

    // Récupération du nombre de fichiers dans le dossier public/files
    const filesDir = path.join(process.cwd(), "public/files");
    const totalFiles = fs.readdirSync(filesDir).length;

    // Récupération du nombre d'images dans le dossier public/uploads
    const imagesDir = path.join(process.cwd(), "public/uploads");
    const totalImages = fs.readdirSync(imagesDir).length;

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
