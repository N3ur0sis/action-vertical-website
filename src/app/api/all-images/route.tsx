import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    // Use Vercel Blob's list method to get all images in the "uploads/" folder
    const blobs = await list({ prefix: 'uploads/' });

    // Transform blob data into an array of URLs
    const images = blobs.blobs.map(blob => ({
      url: blob.url,
      // Blob storage doesn't provide direct ctime, so use blob.metadata if available
      ctime: blob.metadata?.createdAt || 0
    }));

    // Sort images by creation time, most recent first
    images.sort((a, b) => b.ctime - a.ctime);

    return NextResponse.json({ images: images.map(image => image.url) });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}