import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { engagements } from "@/lib/db/schema";

export async function GET() {
  const rows = await db.select().from(engagements).orderBy(desc(engagements.createdAt));
  return NextResponse.json({ engagements: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.customerName || !body.objective) {
    return NextResponse.json(
      { error: "customerName and objective are required." },
      { status: 400 }
    );
  }

  const id = nanoid();
  await db.insert(engagements).values({
    id,
    customerName: body.customerName,
    industry: body.industry ?? null,
    companySize: body.companySize ?? null,
    objective: body.objective,
    currentBaseline: body.currentBaseline ?? null,
    constraints: body.constraints ?? null,
    rawIntake: body.rawIntake ?? null,
    phase: "qualification",
    status: "active",
  });

  return NextResponse.json({ id }, { status: 201 });
}
