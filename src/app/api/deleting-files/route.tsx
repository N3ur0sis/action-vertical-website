import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const { files } = await request.json();

    for (const fileName of files) {
      // Construct the blob path (e.g., files/example.pdf)
      const blobPath = `files/${fileName}`;

      // Attempt to delete the file from Vercel Blob
      await del(blobPath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting files:", error);
    return NextResponse.json({ error: "Failed to delete files" }, { status: 500 });
  }
}