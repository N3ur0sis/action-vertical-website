import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: 'URLs not provided or incorrect format' }, { status: 400 });
    }

    const errors: string[] = [];

    for (const url of urls) {
      try {
        // Extract the path within the blob store from the URL
        // For example, if the URL is https://your-store.vercel-storage.com/uploads/file.jpg,
        // this would isolate "uploads/file.jpg".
        const path = new URL(url).pathname.slice(1);

        // Attempt to delete the file from Vercel Blob
        await del(path);
      } catch (error) {
        errors.push(`Failed to delete ${url}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting files:', error);
    return NextResponse.json({ error: 'Error deleting files' }, { status: 500 });
  }
}