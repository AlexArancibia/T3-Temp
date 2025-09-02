import { prisma } from "@backend/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Aquí podrías verificar cookies o headers de autorización
  // Por ahora, devolvemos una respuesta vacía para usuarios no autenticados
  return NextResponse.json({ user: null });
}

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    // Decodificar el token de sesión
    const sessionData = JSON.parse(atob(sessionToken));

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        isConfirmed: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null });
  }
}
