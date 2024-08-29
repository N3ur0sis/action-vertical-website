import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import sharp from 'sharp';

export async function POST(request: Request) {
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
        const fileName = `${fileId}.jpeg`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

        // Optimisation du traitement et de la compression avec sharp
        const processedBuffer = await sharp(buffer)
          .rotate() // Conserve l'orientation d'origine
          .resize({
            width: 1920,
            height: 1920,
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 70, // Compression JPEG avec qualité à 70% pour un bon compromis
            mozjpeg: true,
            progressive: true, // Progressive JPEG pour un rendu plus rapide sur le web
          })
          .toBuffer();

        await fs.writeFile(filePath, processedBuffer); // Écriture du fichier de manière asynchrone

        urls.push(`/uploads/${fileName}`);
      }
    });

    // Attendre que tous les uploads soient terminés
    await Promise.all(uploadPromises);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Erreur lors de l\'upload des fichiers:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload des fichiers' }, { status: 500 });
  }
}
