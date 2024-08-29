import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const originalFileName = file.name || "default.pdf";  // Récupère le nom d'origine du fichier
    const cleanedFileName = originalFileName
      .toLowerCase()
      .replace(/\s+/g, '-')  // Remplace les espaces par des tirets
      .replace(/[^a-zA-Z0-9.-]/g, '');  // Enlève les caractères spéciaux sauf pour les tirets, points et chiffres

    const filePath = path.join(process.cwd(), "public/files", cleanedFileName);

    // Vérifie si un fichier avec le même nom existe déjà, si oui, ajoute un suffixe
    let finalFilePath = filePath;
    let counter = 1;
    while (await fileExists(finalFilePath)) {
      const baseName = path.basename(cleanedFileName, path.extname(cleanedFileName));
      const extension = path.extname(cleanedFileName);
      finalFilePath = path.join(process.cwd(), "public/files", `${baseName}-${counter}${extension}`);
      counter += 1;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(finalFilePath, buffer);

    const finalFileName = path.basename(finalFilePath);
    return NextResponse.json({ link: `/files/${finalFileName}` });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
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
