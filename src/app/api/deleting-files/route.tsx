import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

export async function DELETE(request) {
  try {
    const { files } = await request.json();

    for (const fileName of files) {
      const filePath = path.join(process.cwd(), "public/files", fileName);
      await fs.unlink(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting files:", error);
    return NextResponse.json({ error: "Failed to delete files" }, { status: 500 });
  }
}
