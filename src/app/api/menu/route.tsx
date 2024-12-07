import { NextResponse } from "next/server";
import prisma from "@/libs/db";

export async function GET() {
  try {
    const [menuItems, pageCount] = await Promise.all([
      prisma.navbarItem.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          route: true,
          type: true,
          children: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              route: true,
              type: true,
            }
          }
        }
      }),
      prisma.navbarItem.count({
        where: { type: 'PAGE' }
      })
    ]);

    return NextResponse.json({ menuItems, pageCount });
  } catch (error) {
    console.error("Failed to fetch menu data:", error);
    return NextResponse.json({ error: "Failed to fetch menu data" }, { status: 500 });
  }
}