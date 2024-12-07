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

export async function POST(request) {
  try {
    const { title, order, parentId, type, externalLink, isActive } = await request.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required and must be a string' }, { status: 400 });
    }

    if (fixedPages.includes(title.toUpperCase())) {
      return NextResponse.json({ error: `Cannot add fixed page: ${title}` }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const route = type === 'EXTERNAL_LINK' ? externalLink : `/pages/${slug}`;

    const newItem = await prisma.navbarItem.create({
      data: {
        title,
        route,
        order,
        parentId,
        type,
        isActive,
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

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Error adding navbar item:", error);
    return NextResponse.json({ error: "Failed to add navbar item" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();

    if (Array.isArray(data)) {
      // Gestion de la réorganisation (mise à jour de plusieurs éléments)
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
    } else if (typeof data === 'object') {
      // Mise à jour d'un seul élément
      const { id, title, order, parentId, type, externalLink, isActive } = data;

      if (!id) {
        return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
      }

      if (!title || typeof title !== 'string') {
        return NextResponse.json({ error: 'Title is required and must be a string' }, { status: 400 });
      }

      if (fixedPages.includes(title.toUpperCase())) {
        return NextResponse.json({ error: `Cannot modify fixed page: ${title}` }, { status: 400 });
      }

      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const route = type === 'EXTERNAL_LINK' ? externalLink : `/pages/${slug}`;

      const existingItem = await prisma.navbarItem.findUnique({ where: { id } });
      if (!existingItem) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }

      const updatedItem = await prisma.navbarItem.update({
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

      // Mettre à jour le contenu de la page si le titre ou le type a changé
      if (type === 'PAGE' && existingItem.title !== title) {
        // Mettre à jour le pageSlug dans pageContent
        await prisma.pageContent.updateMany({
          where: { pageSlug: existingItem.route.replace('/pages/', '') },
          data: { pageSlug: slug },
        });
      }

      return NextResponse.json(updatedItem);
    } else {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating navbar item(s):", error);
    return NextResponse.json({ error: "Failed to update navbar item(s)" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const existingItem = await prisma.navbarItem.findUnique({ where: { id } });
    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (fixedPages.includes(existingItem.title.toUpperCase())) {
      return NextResponse.json({ error: `Cannot delete fixed page: ${existingItem.title}` }, { status: 400 });
    }

    if (existingItem.type === 'PAGE') {
      // Supprimer les contenus associés dans PageContent
      const slug = existingItem.route.replace('/pages/', '');
      await prisma.pageContent.deleteMany({
        where: { pageSlug: slug },
      });
    }

    // Supprimer l'élément navbar
    const deletedItem = await prisma.navbarItem.delete({
      where: { id },
    });

    return NextResponse.json(deletedItem);
  } catch (error) {
    console.error("Error deleting navbar item:", error);
    return NextResponse.json({ error: "Failed to delete navbar item" }, { status: 500 });
  }
}
