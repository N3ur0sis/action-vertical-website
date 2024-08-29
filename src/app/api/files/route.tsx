import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || '';

  const directoryPath = path.join(process.cwd(), 'public', 'files');
  
  try {
    const files = fs.readdirSync(directoryPath).map(file => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      const fileSizeInBytes = stats.size;
      const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
      const fileExtension = path.extname(file).substring(1); // Extension sans le point

      return {
        name: file,
        createdAt: stats.birthtime,
        size: `${fileSizeInMB} Mo`,
        type: fileExtension.toUpperCase(),
      };
    });

    // Filtrer les fichiers par nom
    const filteredFiles = files.filter(file => 
      file.name.toLowerCase().includes(search.toLowerCase())
    );

    // Trier par date de création (du plus récent au plus ancien)
    const sortedFiles = filteredFiles.sort((a, b) => b.createdAt - a.createdAt);

    // Pagination
    const paginatedFiles = sortedFiles.slice((page - 1) * limit, page * limit);

    // Indicateur pour savoir s'il reste plus de fichiers à charger
    const hasMore = page * limit < filteredFiles.length;

    return NextResponse.json({
      files: paginatedFiles,
      total: filteredFiles.length,
      hasMore,
    });

  } catch (error) {
    console.error('Error reading files:', error);
    return NextResponse.json({ error: 'Failed to load files' }, { status: 500 });
  }
};
