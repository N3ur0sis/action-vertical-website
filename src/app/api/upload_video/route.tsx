import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get("file"); // Froala envoie les fichiers sous le nom "file"

    if (!videoFile) {
      return NextResponse.json({ error: "Aucun fichier vidéo reçu" }, { status: 400 });
    }

    const buffer = Buffer.from(await videoFile.arrayBuffer());
    let originalFileName = videoFile.name.replace(/\s+/g, '-').toLowerCase(); // Garde le nom original
    let filePath = path.join(process.cwd(), "public/files", originalFileName);

    // Check if a file with the same name already exists
    const extension = path.extname(originalFileName);
    const baseName = path.basename(originalFileName, extension);

    let counter = 1;
    while (await fileExists(filePath)) {
      originalFileName = `${baseName}-${counter}${extension}`;
      filePath = path.join(process.cwd(), "public/files", originalFileName);
      counter++;
    }

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ link: `/files/${originalFileName}` });
  } catch (error) {
    console.error("Erreur lors du téléchargement de la vidéo:", error);
    return NextResponse.json({ error: "Échec du téléchargement de la vidéo" }, { status: 500 });
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
