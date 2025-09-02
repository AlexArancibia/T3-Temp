import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("🔍 TEST-REDIRECT: Iniciando prueba de redirección");

  // Simular exactamente lo que hace Google
  const googleAuthUrl = new URL("https://accounts.google.com/oauth/authorize");
  googleAuthUrl.searchParams.set(
    "client_id",
    process.env.GOOGLE_CLIENT_ID || "",
  );
  googleAuthUrl.searchParams.set(
    "redirect_uri",
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/google`,
  );
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set(
    "state",
    btoa(JSON.stringify({ callbackUrl: "/" })),
  );

  console.log("🔍 TEST-REDIRECT: URL generada:", googleAuthUrl.toString());
  console.log(
    "🔍 TEST-REDIRECT: redirect_uri:",
    googleAuthUrl.searchParams.get("redirect_uri"),
  );

  return NextResponse.json({
    message: "Test redirect",
    googleAuthUrl: googleAuthUrl.toString(),
    redirectUri: googleAuthUrl.searchParams.get("redirect_uri"),
    clientId: process.env.GOOGLE_CLIENT_ID
      ? "✅ Configurado"
      : "❌ No configurado",
    nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  });
}
