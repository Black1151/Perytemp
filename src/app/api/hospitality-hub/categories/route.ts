import { NextRequest, NextResponse } from 'next/server';
import { categories } from '../mockData/categories';

let categoriesData = [...categories];

export async function GET() {
  return NextResponse.json({ resource: categoriesData });
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const newCategory = {
    id: `cat-${Date.now()}`,
    title: payload.title,
    description: payload.description,
  };
  categoriesData.push(newCategory);
  return NextResponse.json({ resource: newCategory });
}

export async function PUT(req: NextRequest) {
  const payload = await req.json();
  const index = categoriesData.findIndex((c) => c.id === payload.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
  categoriesData[index] = { ...categoriesData[index], ...payload };
  return NextResponse.json({ resource: categoriesData[index] });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const index = categoriesData.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
  const deleted = categoriesData.splice(index, 1)[0];
  return NextResponse.json({ resource: deleted });
}
