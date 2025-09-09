import { prisma } from "@/lib/db";
import {
  DEFAULT_PERMISSIONS,
  DEFAULT_ROLES,
  PermissionAction,
  PermissionResource,
} from "@/types/rbac";

export async function seedRBAC() {
  console.log("🌱 Seeding RBAC system...");

  try {
    // Check if permissions already exist
    const existingPermissions = await prisma.permission.count();
    console.log(`📊 Existing permissions: ${existingPermissions}`);

    // Create permissions
    console.log("Creating permissions...");
    const permissions = await Promise.all(
      Object.entries(DEFAULT_PERMISSIONS).map(async ([key, permission]) => {
        const result = await prisma.permission.upsert({
          where: {
            action_resource: {
              action: permission.action,
              resource: permission.resource,
            },
          },
          update: {},
          create: {
            action: permission.action,
            resource: permission.resource,
            description: `Permission to ${permission.action.toLowerCase()} ${permission.resource.toLowerCase()}`,
          },
        });
        console.log(
          `  ${result.id ? "✅" : "⚠️"} ${key}: ${permission.action}.${permission.resource}`,
        );
        return result;
      }),
    );

    console.log(`✅ Processed ${permissions.length} permissions`);

    // Check if roles already exist
    const existingRoles = await prisma.role.count();
    console.log(`📊 Existing roles: ${existingRoles}`);

    // Create roles
    console.log("Creating roles...");

    // Super Admin Role
    console.log("  Creating Super Admin role...");
    const superAdminRole = await prisma.role.upsert({
      where: { name: DEFAULT_ROLES.SUPER_ADMIN },
      update: {},
      create: {
        name: DEFAULT_ROLES.SUPER_ADMIN,
        displayName: "Super Administrator",
        description: "Full system access with all permissions",
        isSystem: true,
        isActive: true,
      },
    });
    console.log(`  ✅ Super Admin role: ${superAdminRole.id}`);

    // Admin Role
    const adminRole = await prisma.role.upsert({
      where: { name: DEFAULT_ROLES.ADMIN },
      update: {},
      create: {
        name: DEFAULT_ROLES.ADMIN,
        displayName: "Administrator",
        description: "Administrative access to most system features",
        isSystem: true,
        isActive: true,
      },
    });

    // Moderator Role
    const moderatorRole = await prisma.role.upsert({
      where: { name: DEFAULT_ROLES.MODERATOR },
      update: {},
      create: {
        name: DEFAULT_ROLES.MODERATOR,
        displayName: "Moderator",
        description: "Moderation access to user content and basic management",
        isSystem: true,
        isActive: true,
      },
    });

    // Trader Role
    const traderRole = await prisma.role.upsert({
      where: { name: DEFAULT_ROLES.TRADER },
      update: {},
      create: {
        name: DEFAULT_ROLES.TRADER,
        displayName: "Trader",
        description: "Full trading access and account management",
        isSystem: true,
        isActive: true,
      },
    });

    // Viewer Role
    const viewerRole = await prisma.role.upsert({
      where: { name: DEFAULT_ROLES.VIEWER },
      update: {},
      create: {
        name: DEFAULT_ROLES.VIEWER,
        displayName: "Viewer",
        description: "Read-only access to basic features",
        isSystem: true,
        isActive: true,
      },
    });

    console.log("✅ Created 5 default roles");

    // Assign permissions to roles
    console.log("Assigning permissions to roles...");

    // Super Admin gets all permissions
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: superAdminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      });
    }

    // Admin gets most permissions except super admin specific ones
    const adminPermissions = permissions.filter(
      (p) =>
        !p.resource.includes("ROLE") || p.action !== PermissionAction.MANAGE,
    );
    for (const permission of adminPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    }

    // Moderator gets user management and basic permissions
    const moderatorPermissions = permissions.filter(
      (p) =>
        (p.resource === PermissionResource.USER &&
          p.action !== PermissionAction.DELETE) ||
        p.resource === PermissionResource.DASHBOARD ||
        (p.resource === PermissionResource.TRADE &&
          p.action === PermissionAction.READ),
    );
    for (const permission of moderatorPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: moderatorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: moderatorRole.id,
          permissionId: permission.id,
        },
      });
    }

    // Trader gets trading-related permissions
    const traderPermissions = permissions.filter(
      (p) =>
        p.resource === PermissionResource.TRADING_ACCOUNT ||
        p.resource === PermissionResource.TRADE ||
        p.resource === PermissionResource.DASHBOARD ||
        p.resource === PermissionResource.SYMBOL ||
        p.resource === PermissionResource.PROPFIRM ||
        p.resource === PermissionResource.BROKER,
    );
    for (const permission of traderPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: traderRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: traderRole.id,
          permissionId: permission.id,
        },
      });
    }

    // Viewer gets read-only permissions
    const viewerPermissions = permissions.filter(
      (p) =>
        p.action === PermissionAction.READ &&
        (p.resource === PermissionResource.DASHBOARD ||
          p.resource === PermissionResource.TRADE ||
          p.resource === PermissionResource.SYMBOL ||
          p.resource === PermissionResource.PROPFIRM ||
          p.resource === PermissionResource.BROKER),
    );
    for (const permission of viewerPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: viewerRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: viewerRole.id,
          permissionId: permission.id,
        },
      });
    }

    console.log("✅ Assigned permissions to roles");

    // Assign default role to existing users
    console.log("Assigning default roles to existing users...");
    const existingUsers = await prisma.user.findMany({
      where: {
        userRoles: {
          none: {},
        },
      },
    });

    for (const user of existingUsers) {
      // Assign trader role by default
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: traderRole.id,
        },
      });
    }

    console.log(
      `✅ Assigned default role to ${existingUsers.length} existing users`,
    );

    console.log("🎉 RBAC system seeded successfully!");

    return {
      roles: [superAdminRole, adminRole, moderatorRole, traderRole, viewerRole],
      permissions: permissions.length,
    };
  } catch (error) {
    console.error("❌ Error seeding RBAC system:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.main) {
  seedRBAC()
    .then(() => {
      console.log("RBAC seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("RBAC seeding failed:", error);
      process.exit(1);
    });
}
