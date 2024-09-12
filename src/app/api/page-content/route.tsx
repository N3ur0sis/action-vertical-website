import { NextResponse } from 'next/server';
import prisma from '@/libs/db';

// Création d'une nouvelle section de page
export async function POST(request: Request) {
  try {
    const { pageSlug, contentType, content, order } = await request.json();

    // Stocker directement l'objet JSON sans sérialisation en chaîne
    const newContent = await prisma.pageContent.create({
      data: {
        pageSlug,
        contentType,
        content: JSON.stringify(content), // Sérialiser une seule fois ici
        order,
      },
    });

    return NextResponse.json(newContent);
  } catch (error) {
    console.error("Error adding content to page:", error);
    return NextResponse.json({ error: "Failed to add content" }, { status: 500 });
  }
}

// Lecture des sections d'une page
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const pageContent = await prisma.pageContent.findMany({
      where: { pageSlug: slug },
      orderBy: { order: 'asc' },
    });

    const parsedContent = pageContent.map((section) => ({
      ...section,
      content: JSON.parse(section.content), // Désérialiser le contenu avant de l'envoyer
    }));

    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json({ error: "Failed to fetch page content" }, { status: 500 });
  }
}

// Mise à jour des sections d'une page
export async function PUT(request: Request) {
  try {
    const sections = await request.json();

    const updatePromises = sections.map(async (section) => {
      if (!section.id) {
        return await prisma.pageContent.create({
          data: {
            pageSlug: section.pageSlug,
            contentType: section.contentType,
            content: JSON.stringify(section.content), // Sérialiser une seule fois ici
            order: section.order,
          },
        });
      } else {
        return await prisma.pageContent.update({
          where: { id: section.id },
          data: {
            contentType: section.contentType,
            content: JSON.stringify(section.content), // Sérialiser une seule fois ici
            order: section.order,
          },
        });
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating page content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

// Suppression d'une section de page
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedContent = await prisma.pageContent.delete({
      where: { id },
    });

    return NextResponse.json(deletedContent);
  } catch (error) {
    console.error("Error deleting page content:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}
