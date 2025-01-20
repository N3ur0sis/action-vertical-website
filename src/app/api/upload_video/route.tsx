import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get("file") as File | null; // Froala sends the files under the "file" name

    if (!videoFile) {
      return NextResponse.json({ error: "No video file received" }, { status: 400 });
    }

    // Sanitize the file name
    const originalFileName = videoFile.name.replace(/\s+/g, '-').toLowerCase();
    const blobPath = `videos/${originalFileName}`;

    // Upload to Vercel Blob
    const blob = await put(blobPath, videoFile, {
      access: "public",
      contentType: videoFile.type,
    });

    return NextResponse.json({ link: blob.url });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
  }
}