import { NextResponse } from 'next/server';
import prisma from "@/libs/db"; // Assurez-vous que ce chemin est correct

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 4;
  const skip = (page - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,  // Filtrer pour n'obtenir que les articles publiés
      },
      orderBy: {
        updatedAt: 'desc',  // Trier par date de mise à jour (du plus récent au plus ancien)
      },
      skip,
      take: limit,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
