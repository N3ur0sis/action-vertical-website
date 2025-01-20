import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import sharp from 'sharp';
import { put } from '@vercel/blob';

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

        // Upload the optimized buffer to the "uploads/" folder in Vercel Blob
        const blob = await put(`uploads/${fileName}`, processedBuffer, {
          access: 'public',
          contentType: mimeType,
        });

        urls.push(blob.url);
      }
    });

    await Promise.all(uploadPromises);

    // Return the URL of the first uploaded file
    return NextResponse.json({ link: urls[0] });
  } catch (error) {
    console.error("Error during file upload via Froala:", error);
    return NextResponse.json({ error: "Error uploading files" }, { status: 500 });
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
        // Convert the Blob to a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate a unique file name
        const fileId = uuidv4();
        const mimeType = file.type || 'application/octet-stream';
        const extension = mime.extension(mimeType) || 'jpeg';
        const fileName = `${fileId}.${extension}`;

        // Use sharp to process the image
        const processedBuffer = await sharp(buffer)
          .rotate() // Automatically orient the image
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

        // Upload the optimized image buffer to Vercel Blob
        const blob = await put(`uploads/${fileName}`, processedBuffer, {
          access: 'public',
          contentType: mimeType,
        });

        // Add the blob URL to the result list
        urls.push(blob.url);
      }
    });

    await Promise.all(uploadPromises);

    return new Response(JSON.stringify({ urls }), { status: 200 });
  } catch (error) {
    console.error("Error during file upload:", error);
    return new Response(JSON.stringify({ error: "Error uploading files" }), { status: 500 });
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
