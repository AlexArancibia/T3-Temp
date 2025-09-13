import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { RBACService } from "@/services/rbacService";
import {
  PermissionAction,
  type PermissionCheck,
  PermissionResource,
} from "@/types/rbac";
import type { JWTPayload } from "@/types/user";

// Validar JWT_SECRET al inicializar
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

/**
 * Extract and validate JWT token from request
 */
export async function extractUserFromRequest(
  req: NextRequest,
): Promise<JWTPayload | null> {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET!) as unknown as JWTPayload;

    if (!payload.userId || !payload.email) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Error extracting user from request:", error);
    return null;
  }
}

/**
 * Base middleware for authentication
 */
export function createAuthMiddleware() {
  return async (req: NextRequest) => {
    const user = await extractUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 },
      );
    }

    return { user };
  };
}

/**
 * Base middleware for permission checking
 */
export function createPermissionMiddleware(
  action: PermissionAction,
  resource: PermissionResource,
) {
  return async (req: NextRequest) => {
    const authResult = await createAuthMiddleware()(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    try {
      const hasPermission = await RBACService.hasPermission(
        user.userId,
        action,
        resource,
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 },
        );
      }

      return { user };
    } catch (error) {
      console.error("Permission check error:", error);
      return NextResponse.json(
        { error: "Permission check failed" },
        { status: 500 },
      );
    }
  };
}

/**
 * Base middleware for role checking
 */
export function createRoleMiddleware(roleName: string) {
  return async (req: NextRequest) => {
    const authResult = await createAuthMiddleware()(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    try {
      const hasRole = await RBACService.hasRole(user.userId, roleName);

      if (!hasRole) {
        return NextResponse.json(
          { error: "Insufficient role permissions" },
          { status: 403 },
        );
      }

      return { user };
    } catch (error) {
      console.error("Role check error:", error);
      return NextResponse.json({ error: "Role check failed" }, { status: 500 });
    }
  };
}

/**
 * Base middleware for multiple permissions checking
 */
export function createMultiPermissionMiddleware(
  permissionChecks: PermissionCheck[],
  requireAll: boolean = false,
) {
  return async (req: NextRequest) => {
    const authResult = await createAuthMiddleware()(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    try {
      const hasPermission = requireAll
        ? await RBACService.hasAllPermissions(user.userId, permissionChecks)
        : await RBACService.hasAnyPermission(user.userId, permissionChecks);

      if (!hasPermission) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 },
        );
      }

      return { user };
    } catch (error) {
      console.error("Multi-permission check error:", error);
      return NextResponse.json(
        { error: "Permission check failed" },
        { status: 500 },
      );
    }
  };
}
