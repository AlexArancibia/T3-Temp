import { NextResponse } from "next/server";

export async function POST() {
  // Aquí podrías invalidar tokens o cookies
  // Por ahora, solo redirigimos al usuario
  return NextResponse.json({ success: true });
}
