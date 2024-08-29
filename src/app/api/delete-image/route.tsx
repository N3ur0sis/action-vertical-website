import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: 'URLs not provided or incorrect format' }, { status: 400 });
    }

    const errors = [];

    urls.forEach((url) => {
      const filePath = path.join(process.cwd(), 'public', url);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          errors.push(`Failed to delete ${url}: ${error.message}`);
        }
      } else {
        errors.push(`File not found: ${url}`);
      }
    });

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting files:', error);
    return NextResponse.json({ error: 'Error deleting files' }, { status: 500 });
  }
}
