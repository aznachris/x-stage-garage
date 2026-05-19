import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson, genId } from "@/lib/db";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const appointments = await readJson<Appointment[]>("appointments.json", []);

  if (date) {
    const times = appointments
      .filter((a) => a.date === date && a.status !== "cancelled")
      .map((a) => a.time);
    return NextResponse.json(times);
  }

  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const appointments = await readJson<Appointment[]>("appointments.json", []);

  const appointment: Appointment = {
    id: genId(),
    date: body.date,
    time: body.time,
    service: body.service,
    name: body.name,
    email: body.email,
    phone: body.phone,
    vehicle: body.vehicle ?? "",
    notes: body.notes ?? "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);
  await writeJson("appointments.json", appointments);

  return NextResponse.json(appointment, { status: 201 });
}
