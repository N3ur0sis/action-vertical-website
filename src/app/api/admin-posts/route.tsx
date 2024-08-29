import { NextResponse } from 'next/server';
import prisma from "@/libs/db";

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;
  const skip = (page - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    const { id, title, body, coverImage } = await request.json(); // Ajoutez `coverImage`

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, body, coverImage }, // Ajoutez `coverImage` dans la mise à jour
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
};


export const DELETE = async (request) => {
  try {
    const { ids } = await request.json();

    await prisma.post.deleteMany({
      where: { id: { in: ids.map((id) => Number(id)) } },
    });

    return NextResponse.json({ message: "Posts deleted successfully" });
  } catch (error) {
    console.error("Error deleting posts:", error);
    return NextResponse.json({ error: "Failed to delete posts" }, { status: 500 });
  }
};
