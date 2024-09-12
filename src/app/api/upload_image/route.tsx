import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import sharp from 'sharp';

// Fonction pour l'upload via Froala
async function uploadViaFroala(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll('file');

  const urls: string[] = [];

  try {
    const uploadPromises = files.map(async (file) => {
      if (file instanceof Blob) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileId = uuidv4();
        const mimeType = file.type || 'application/octet-stream';
        const extension = mime.extension(mimeType) || 'jpeg';
        const fileName = `${fileId}.${extension}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

        // Optimisation du traitement et de la compression avec sharp
        const processedBuffer = await sharp(buffer)
          .rotate()
          .resize({
            width: 1920,
            height: 1920,
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 70,
            mozjpeg: true,
            progressive: true,
          })
          .toBuffer();

        await fs.writeFile(filePath, processedBuffer);

        urls.push(`/uploads/${fileName}`);
      }
    });

    await Promise.all(uploadPromises);

    return NextResponse.json({ link: urls[0] });
  } catch (error) {
    console.error('Erreur lors de l\'upload des fichiers via Froala:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload des fichiers' }, { status: 500 });
  }
}

// Fonction pour l'upload de la galerie
async function uploadForGallery(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll('files');

  const urls: string[] = [];

  try {
    const uploadPromises = files.map(async (file) => {
      if (file instanceof Blob) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileId = uuidv4();
        const mimeType = file.type || 'application/octet-stream';
        const extension = mime.extension(mimeType) || 'jpeg';
        const fileName = `${fileId}.${extension}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

        // Optimisation du traitement et de la compression avec sharp
        const processedBuffer = await sharp(buffer)
          .rotate()
          .resize({
            width: 1920,
            height: 1920,
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 70,
            mozjpeg: true,
            progressive: true,
          })
          .toBuffer();

        await fs.writeFile(filePath, processedBuffer);

        urls.push(`/uploads/${fileName}`);
      }
    });

    await Promise.all(uploadPromises);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Erreur lors de l\'upload des fichiers:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload des fichiers' }, { status: 500 });
  }
}

// Route principale de l'API
export async function POST(request: Request) {
  const url = new URL(request.url);
  const uploadType = url.searchParams.get('type');

  if (uploadType === 'froala') {
    return uploadViaFroala(request);
  } else {
    return uploadForGallery(request);
  }
}
