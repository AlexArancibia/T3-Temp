
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	// Middleware básico, puedes agregar lógica personalizada aquí
	return NextResponse.next();
}
