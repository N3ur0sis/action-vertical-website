import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";

  try {
    // Fetch files from the "files/" folder in Vercel Blob
    const blobsResponse = await list({
      prefix: "files/",
      limit,
      pageToken: page > 1 ? `page:${page}` : undefined,
    });

    const blobs = blobsResponse.blobs;

    // Filter files by name if a search query is provided
    const filteredBlobs = search
      ? blobs.filter((blob) =>
          blob.pathname.toLowerCase().includes(search.toLowerCase())
        )
      : blobs;

    // Map the filtered blobs to match the original structure
    const mappedFiles = filteredBlobs.map((blob) => ({
      name: blob.pathname.split("/").pop() || "unknown",
      url: blob.url, // Add the public URL for the blob
      createdAt: new Date(blob.metadata?.createdAt || Date.now()),
      size: `${(blob.size / (1024 * 1024)).toFixed(2)} Mo`,
      type: blob.pathname.split(".").pop()?.toUpperCase() || "UNKNOWN",
    }));

    // Sort by creation date (most recent first)
    const sortedFiles = mappedFiles.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Determine if there are more files
    const hasMore = !!blobsResponse.nextPageToken;

    return NextResponse.json({
      files: sortedFiles,
      total: sortedFiles.length,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json({ error: "Failed to load files" }, { status: 500 });
  }
};