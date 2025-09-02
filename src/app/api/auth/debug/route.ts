import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const allParams = Object.fromEntries(searchParams.entries());

  console.log("🔍 DEBUG: Parámetros recibidos:", allParams);
  console.log("🔍 DEBUG: URL completa:", request.url);
  console.log(
    "🔍 DEBUG: Headers:",
    Object.fromEntries(request.headers.entries()),
  );

  return NextResponse.json({
    message: "Debug route",
    params: allParams,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  });
}
