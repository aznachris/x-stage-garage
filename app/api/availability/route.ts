import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { readJson, writeJson } from "@/lib/db";

export interface Availability {
  workingDays: number[];
  startHour: number;
  endHour: number;
  slotDuration: number;
  blockedDates: string[];
}

const DEFAULT: Availability = {
  workingDays: [1, 2, 3, 4, 5, 6],
  startHour: 8,
  endHour: 18,
  slotDuration: 60,
  blockedDates: [],
};

export async function GET() {
  return NextResponse.json(await readJson<Availability>("availability.json", DEFAULT));
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await writeJson("availability.json", { ...DEFAULT, ...body });
  return NextResponse.json(body);
}
