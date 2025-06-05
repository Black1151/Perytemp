import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const configPath = path.join(
  process.cwd(),
  'src',
  'app',
  '(site)',
  '(apps-non-standard)',
  'hospitality-hub',
  'hospitalityHubConfig.json'
);

export async function GET() {
  try {
    const data = await fs.readFile(configPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newCategory = await req.json();
    const data = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(data);
    config.push(newCategory);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    return NextResponse.json({ message: 'Category added' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
