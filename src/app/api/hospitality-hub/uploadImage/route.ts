import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("imageUrl");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadDir = join(process.cwd(), "public", "uploads", "hospitality");
  await mkdir(uploadDir, { recursive: true });
  const filename = `${Date.now()}-${(file as File).name}`;
  await writeFile(join(uploadDir, filename), buffer);

  return NextResponse.json({ imageUrl: `/uploads/hospitality/${filename}` });
}
