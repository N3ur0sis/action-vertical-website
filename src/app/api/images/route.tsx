import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

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

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Pagination des images sans duplication
  const paginatedImages = allImages.slice(startIndex, endIndex);
  const hasMore = endIndex < allImages.length;

  return NextResponse.json({ images: paginatedImages, hasMore });
}
