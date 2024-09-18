import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const imageDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(imageDir)) {
      console.error("Directory not found:", imageDir);
      return NextResponse.json({ error: "Directory not found" }, { status: 404 });
    }

    const allImages = fs.readdirSync(imageDir)
      .filter(file => !file.startsWith('.') && (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')))
      .map(file => ({
        url: `/uploads/${file}`,
        ctime: fs.statSync(path.join(imageDir, file)).ctime.getTime()
      }));

    // Sort images by creation time, most recent first
    allImages.sort((a, b) => b.ctime - a.ctime);

    return NextResponse.json({ images: allImages.map(image => image.url) });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
