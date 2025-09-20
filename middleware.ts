import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/", "/api/auth", "/api/test"];

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ["/dashboard", "/trader", "/profile", "/admin"];

  // Verificar si la ruta actual es protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Si es una ruta protegida, verificar autenticación
  if (isProtectedRoute) {
    // Aquí podrías agregar lógica adicional de verificación de tokens
    // Por ahora, solo permitimos el acceso (better-auth maneja la autenticación)
    return NextResponse.next();
  }

  // Para rutas públicas, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Para otras rutas, permitir acceso por defecto
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
