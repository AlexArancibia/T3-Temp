import { prisma } from "@backend/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  try {
    // Intercambiar el código por tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/google`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(
        "❌ Error al obtener tokens:",
        tokenResponse.status,
        errorText,
      );
      throw new Error(`Failed to get tokens: ${tokenResponse.status}`);
    }

    const tokens = await tokenResponse.json();

    // Obtener información del usuario
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error(
        "❌ Error al obtener información del usuario:",
        userResponse.status,
        errorText,
      );
      throw new Error(`Failed to get user info: ${userResponse.status}`);
    }

    const userInfo = await userResponse.json();
    console.log("✅ Información del usuario obtenida:", {
      email: userInfo.email,
      name: userInfo.name,
    });

    // Buscar o crear usuario en la base de datos
    let user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (!user) {
      // Crear nuevo usuario
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          image: userInfo.picture,
          isConfirmed: true, // Usuarios de Google están confirmados
        },
      });
    } else {
      console.log("✅ Usuario existente encontrado:");
    }

    // Crear sesión (aquí podrías usar JWT o cookies)
    // Por ahora, redirigimos con un token simple
    const sessionToken = btoa(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
      }),
    );

    // Redirigir al usuario con el token de sesión
    const callbackUrl = state ? JSON.parse(atob(state)).callbackUrl : "/";
    const redirectUrl = new URL(
      callbackUrl,
      process.env.NEXTAUTH_URL || "http://localhost:3000",
    );
    redirectUrl.searchParams.set("session", sessionToken);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (_error) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/?error=oauth_failed`);
  }
}
