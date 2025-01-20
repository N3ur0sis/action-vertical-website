import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const originalFileName = file.name || "default.pdf";
    const cleanedFileName = originalFileName
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^a-zA-Z0-9.-]/g, ''); // Remove special characters except dashes, dots, and numbers

    // Upload the file to the "files/" folder in Vercel Blob
    const blob = await put(`files/${cleanedFileName}`, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ link: blob.url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}