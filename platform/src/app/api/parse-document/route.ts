import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    if (name.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const result = await pdfParse(buffer);
      return NextResponse.json({ text: result.text });
    }

    if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value });
    }

    // Plain text formats (.txt, .md) — decode directly.
    return NextResponse.json({ text: buffer.toString("utf-8") });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `Could not extract text from ${file.name}: ${err.message}`
            : `Could not extract text from ${file.name}.`,
      },
      { status: 422 }
    );
  }
}
