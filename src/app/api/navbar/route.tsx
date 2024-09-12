import { NextResponse } from 'next/server';
import prisma from '@/libs/db';

const fixedPages = ["ACCUEIL", "ACTUALITÉS"];

export async function GET() {
  try {
    const navbarItems = await prisma.navbarItem.findMany({
      orderBy: { order: 'asc' },
      include: { children: true },
    });
    return NextResponse.json(navbarItems);
  } catch (error) {
    console.error("Error fetching navbar items:", error);
    return NextResponse.json({ error: "Failed to fetch navbar items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, title, order, parentId, type, externalLink, isActive } = await request.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required and must be a string' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/ /g, '-');

    if (fixedPages.includes(title.toUpperCase())) {
      return NextResponse.json({ error: `Cannot add or modify fixed page: ${title}` }, { status: 400 });
    }

    const route = type === 'EXTERNAL_LINK' ? externalLink : `/pages/${slug}`;
    let newItem;

    if (id) {
      const existingItem = await prisma.navbarItem.findUnique({ where: { id } });
      if (!existingItem) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }

      newItem = await prisma.navbarItem.update({
        where: { id },
        data: {
          title,
          route,
          order,
          parentId,
          type,
          isActive,
        },
      });
    } else {
      newItem = await prisma.navbarItem.create({
        data: {
          title,
          route,
          order,
          parentId,
          type,
          isActive: isActive,
        },
      });

      if (type === 'PAGE') {
        await prisma.pageContent.create({
          data: {
            pageSlug: slug,
            contentType: 'TITLE',
            content: JSON.stringify({ text: `Bienvenue sur la page ${title}` }),
            order: 1,
          },
        });
      }
    }

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Error adding or updating navbar item:", error);
    return NextResponse.json({ error: "Failed to add or update navbar item" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    if (!data || typeof data !== 'object' || !Array.isArray(data)) {
      return NextResponse.json({ error: "Data must be an array of objects" }, { status: 400 });
    }

    const updatePromises = data.map(item => {
      if (!item.id) {
        throw new Error('Item ID is required for update');
      }
      return prisma.navbarItem.update({
        where: { id: item.id },
        data: { order: item.order, parentId: item.parentId },
      });
    });

    await Promise.all(updatePromises);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering navbar items:", error);
    return NextResponse.json({ error: "Failed to reorder navbar items" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, title } = await request.json();

    if (!id || !title || typeof title !== 'string') {
      return NextResponse.json({ error: 'ID and Title are required and must be valid' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/ /g, '-');

    if (fixedPages.includes(title.toUpperCase())) {
      return NextResponse.json({ error: `Cannot delete fixed page: ${title}` }, { status: 400 });
    }

    const existingItem = await prisma.navbarItem.findUnique({ where: { id } });
    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (existingItem.type === 'PAGE') {
      // Supprimer les contenus associés dans PageContent
      await prisma.pageContent.deleteMany({
        where: { pageSlug: slug },
      });
    }

    const deletedItem = await prisma.navbarItem.delete({
      where: { id },
    });

    return NextResponse.json(deletedItem);
  } catch (error) {
    console.error("Error deleting navbar item:", error);
    return NextResponse.json({ error: "Failed to delete navbar item" }, { status: 500 });
  }
}
