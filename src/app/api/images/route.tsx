import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    // Adjust the prefix as needed to match your Vercel Blob store’s folder structure
    const blobsResponse = await list({
      prefix: 'uploads/',
      limit,
      pageToken: page > 1 ? `page:${page}` : undefined,
    });

    // Transform blob data into an array of URLs
    const images = blobsResponse.blobs.map(blob => blob.url);

    // Check if there are more blobs for the next page
    const hasMore = !!blobsResponse.nextPageToken;

    return NextResponse.json({ images, hasMore });
  } catch (error) {
    console.error('Error fetching blobs:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}