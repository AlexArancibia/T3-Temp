import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Construir la URL de autorización de Google (OAuth v2)
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
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
    btoa(JSON.stringify({ callbackUrl })),
  );

  return NextResponse.redirect(googleAuthUrl.toString());
}
