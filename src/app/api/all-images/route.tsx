import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const imageDir = path.join(process.cwd(), 'public/uploads');
    const allImages = fs.readdirSync(imageDir)
      .filter(file => !file.startsWith('.')) // Filtrer les fichiers cachés
      .map(file => `/uploads/${file}`);

    // Tri des images par date de création (du plus récent au plus ancien)
    allImages.sort((a, b) => {
      const aTime = fs.statSync(path.join(imageDir, path.basename(a))).ctime.getTime();
      const bTime = fs.statSync(path.join(imageDir, path.basename(b))).ctime.getTime();
      return bTime - aTime;
    });

    return NextResponse.json({ images: allImages });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
