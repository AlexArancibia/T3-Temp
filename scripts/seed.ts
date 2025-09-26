#!/usr/bin/env bun

import { prisma } from "../src/lib/db";
import {
  DEFAULT_ROLES,
  PermissionAction,
  PermissionResource,
} from "../src/types/rbac";

async function seedAll() {
  console.log("🌱 Starting complete database seed...");

  try {
    // 1. Seed RBAC System
    console.log("\n📋 Step 1: Seeding RBAC system...");
    await seedRBAC();

    // 2. Seed Users with Roles
    console.log("\n👤 Step 2: Seeding users with roles...");
    await seedUsers();

    // 3. Seed Trading Data
    console.log("\n📊 Step 3: Seeding trading data...");
    await seedTradingData();

    console.log("\n🎉 Complete database seed finished successfully!");
    console.log("\n📧 User credentials:");
    console.log("   Super Admin:");
    console.log("     Email: admin@example.com");
    console.log("     Password: admin123");
    console.log("     Role: Super Administrator");
    console.log("   Administrator:");
    console.log("     Email: administrator@example.com");
    console.log("     Password: admin123");
    console.log("     Role: Administrator");
    console.log("   Moderator:");
    console.log("     Email: moderator@example.com");
    console.log("     Password: moderator123");
    console.log("     Role: Moderator");
    console.log("   Traders:");
    console.log("     Email: trader1@example.com | Password: trader123");
    console.log("     Email: trader2@example.com | Password: trader123");
    console.log("     Role: Trader");
    console.log("   Viewer:");
    console.log("     Email: viewer@example.com");
    console.log("     Password: viewer123");
    console.log("     Role: Viewer");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedRBAC() {
  console.log("🔐 Creating permissions...");

  const permissions = [
    // User permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.USER,
      description: "Create users",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.USER,
      description: "Read users",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.USER,
      description: "Update users",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.USER,
      description: "Delete users",
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.USER,
      description: "Manage users",
    },

    // Role permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.ROLE,
      description: "Create roles",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.ROLE,
      description: "Read roles",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.ROLE,
      description: "Update roles",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.ROLE,
      description: "Delete roles",
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.ROLE,
      description: "Manage roles",
    },

    // Trading Account permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.TRADING_ACCOUNT,
      description: "Create trading accounts",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.TRADING_ACCOUNT,
      description: "Read trading accounts",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.TRADING_ACCOUNT,
      description: "Update trading accounts",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.TRADING_ACCOUNT,
      description: "Delete trading accounts",
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.TRADING_ACCOUNT,
      description: "Manage trading accounts",
    },

    // Trade permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.TRADE,
      description: "Create trades",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.TRADE,
      description: "Read trades",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.TRADE,
      description: "Update trades",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.TRADE,
      description: "Delete trades",
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.TRADE,
      description: "Manage trades",
    },

    // Propfirm permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.PROPFIRM,
      description: "Create propfirms",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.PROPFIRM,
      description: "Read propfirms",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.PROPFIRM,
      description: "Update propfirms",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.PROPFIRM,
      description: "Delete propfirms",
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.PROPFIRM,
      description: "Manage propfirms",
    },

    // Broker permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.BROKER,
      description: "Create brokers",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.BROKER,
      description: "Read brokers",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.BROKER,
      description: "Update brokers",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.BROKER,
      description: "Delete brokers",
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.BROKER,
      description: "Manage brokers",
    },

    // Symbol permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.SYMBOL,
      description: "Create symbols",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.SYMBOL,
      description: "Read symbols",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.SYMBOL,
      description: "Update symbols",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.SYMBOL,
      description: "Delete symbols",
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.SYMBOL,
      description: "Manage symbols",
    },

    // Subscription permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.SUBSCRIPTION,
      description: "Create subscriptions",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.SUBSCRIPTION,
      description: "Read subscriptions",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.SUBSCRIPTION,
      description: "Update subscriptions",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.SUBSCRIPTION,
      description: "Delete subscriptions",
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.SUBSCRIPTION,
      description: "Manage subscriptions",
    },

    // Dashboard permissions
    {
      action: PermissionAction.READ,
      resource: PermissionResource.DASHBOARD,
      description: "Read dashboard",
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.ADMIN,
      description: "Manage admin",
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        action_resource: {
          action: permission.action,
          resource: permission.resource,
        },
      },
      update: permission,
      create: permission,
    });
  }

  console.log("✅ Permissions created");

  console.log("👑 Creating roles...");

  const superAdminRole = await prisma.role.upsert({
    where: { name: DEFAULT_ROLES.SUPER_ADMIN },
    update: {},
    create: {
      name: DEFAULT_ROLES.SUPER_ADMIN,
      displayName: "Super Administrator",
      description: "Full system access with all permissions",
      isActive: true,
      isSystem: true,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: DEFAULT_ROLES.ADMIN },
    update: {},
    create: {
      name: DEFAULT_ROLES.ADMIN,
      displayName: "Administrator",
      description: "Administrative access with most permissions",
      isActive: true,
      isSystem: true,
    },
  });

  const moderatorRole = await prisma.role.upsert({
    where: { name: DEFAULT_ROLES.MODERATOR },
    update: {},
    create: {
      name: DEFAULT_ROLES.MODERATOR,
      displayName: "Moderator",
      description: "Moderation access with limited permissions",
      isActive: true,
      isSystem: true,
    },
  });

  const traderRole = await prisma.role.upsert({
    where: { name: DEFAULT_ROLES.TRADER },
    update: {},
    create: {
      name: DEFAULT_ROLES.TRADER,
      displayName: "Trader",
      description: "Trading access with trading-related permissions",
      isActive: true,
      isSystem: true,
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: DEFAULT_ROLES.VIEWER },
    update: {},
    create: {
      name: DEFAULT_ROLES.VIEWER,
      displayName: "Viewer",
      description: "Read-only access with minimal permissions",
      isActive: true,
      isSystem: true,
    },
  });

  console.log("✅ Roles created");

  console.log("🔗 Assigning permissions to roles...");

  const allPermissions = await prisma.permission.findMany();

  // Super Admin gets all permissions
  for (const permission of allPermissions) {
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

  // Admin gets all permissions except MANAGE_ROLE
  const adminPermissions = allPermissions.filter(
    (p) =>
      !(
        p.action === PermissionAction.MANAGE &&
        p.resource === PermissionResource.ROLE
      ),
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

  // Moderator gets limited permissions
  const moderatorPermissions = allPermissions.filter(
    (p) =>
      (p.action === PermissionAction.CREATE &&
        p.resource === PermissionResource.USER) ||
      (p.action === PermissionAction.READ &&
        p.resource === PermissionResource.USER) ||
      (p.action === PermissionAction.UPDATE &&
        p.resource === PermissionResource.USER) ||
      (p.action === PermissionAction.MANAGE &&
        p.resource === PermissionResource.USER) ||
      (p.action === PermissionAction.READ &&
        p.resource === PermissionResource.TRADE) ||
      (p.action === PermissionAction.READ &&
        p.resource === PermissionResource.DASHBOARD),
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
  const traderPermissions = allPermissions.filter(
    (p) =>
      p.resource === PermissionResource.TRADING_ACCOUNT ||
      p.resource === PermissionResource.TRADE ||
      p.resource === PermissionResource.PROPFIRM ||
      p.resource === PermissionResource.BROKER ||
      p.resource === PermissionResource.SYMBOL ||
      (p.action === PermissionAction.READ &&
        p.resource === PermissionResource.DASHBOARD),
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
  const viewerPermissions = allPermissions.filter(
    (p) =>
      p.action === PermissionAction.READ &&
      (p.resource === PermissionResource.TRADE ||
        p.resource === PermissionResource.PROPFIRM ||
        p.resource === PermissionResource.BROKER ||
        p.resource === PermissionResource.SYMBOL ||
        p.resource === PermissionResource.DASHBOARD),
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

  console.log("✅ Permissions assigned to roles");

  // Assign default roles to users without roles
  const usersWithoutRoles = await prisma.user.findMany({
    where: {
      userRoles: {
        none: {},
      },
    },
  });

  for (const user of usersWithoutRoles) {
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: traderRole.id,
        assignedAt: new Date(),
      },
    });
  }

  console.log(
    `✅ Assigned default trader role to ${usersWithoutRoles.length} users without roles`,
  );
}

async function seedUsers() {
  console.log("👤 Creating users with roles...");

  // Get all roles first
  const roles = await prisma.role.findMany();
  const roleMap = new Map(roles.map((role) => [role.name, role]));

  // Define users with their roles
  const usersToCreate = [
    {
      email: "admin@example.com",
      name: "Super Admin",
      roleName: DEFAULT_ROLES.SUPER_ADMIN,
      phone: "+1-555-0101",
      password: "admin123",
    },
    {
      email: "administrator@example.com",
      name: "System Administrator",
      roleName: DEFAULT_ROLES.ADMIN,
      phone: "+1-555-0102",
      password: "admin123",
    },
    {
      email: "moderator@example.com",
      name: "Content Moderator",
      roleName: DEFAULT_ROLES.MODERATOR,
      phone: "+1-555-0103",
      password: "moderator123",
    },
    {
      email: "trader1@example.com",
      name: "John Trader",
      roleName: DEFAULT_ROLES.TRADER,
      phone: "+1-555-0104",
      password: "trader123",
    },
    {
      email: "trader2@example.com",
      name: "Maria Trader",
      roleName: DEFAULT_ROLES.TRADER,
      phone: "+1-555-0105",
      password: "trader123",
    },
    {
      email: "viewer@example.com",
      name: "Observer User",
      roleName: DEFAULT_ROLES.VIEWER,
      phone: "+1-555-0106",
      password: "viewer123",
    },
  ];

  for (const userData of usersToCreate) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: userData.email,
      },
    });

    if (existingUser) {
      console.log(`⚠️ User already exists: ${userData.email}`);

      // Check if user has any roles assigned
      const existingUserRoles = await prisma.userRole.findMany({
        where: {
          userId: existingUser.id,
        },
        include: {
          role: true,
        },
      });

      const targetRole = roleMap.get(userData.roleName);
      if (!targetRole) {
        console.log(`❌ Role ${userData.roleName} not found`);
        continue;
      }

      const hasCorrectRole = existingUserRoles.some(
        (ur) => ur.role.name === userData.roleName,
      );

      if (hasCorrectRole) {
        console.log(`✅ User ${userData.email} already has correct role`);
        continue;
      }

      // Fix the role assignment - remove existing and assign new one
      await prisma.userRole.deleteMany({
        where: {
          userId: existingUser.id,
        },
      });

      await prisma.userRole.create({
        data: {
          userId: existingUser.id,
          roleId: targetRole.id,
          assignedAt: new Date(),
        },
      });

      // Update password also if needed
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await prisma.account.updateMany({
        where: { userId: existingUser.id, providerId: "credential" },
        data: { password: hashedPassword },
      });

      console.log(`✅ Fixed role for user: ${userData.email}`);
      continue;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        emailVerified: true,
        phone: userData.phone,
        language: "EN",
        defaultRiskPercentage: 1.0,
      },
    });

    // Hash password properly for Better Auth
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create account for Better Auth
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Get the role for this user
    const targetRole = roleMap.get(userData.roleName);
    if (!targetRole) {
      console.log(
        `❌ Role ${userData.roleName} not found. Skipping user ${userData.email}`,
      );
      continue;
    }

    // Assign role to user
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: targetRole.id,
        assignedAt: new Date(),
      },
    });

    console.log(
      `✅ Created user ${userData.email} with role ${userData.roleName}`,
    );
  }

  console.log("✅ Users created with assigned roles");
}

async function seedTradingData() {
  console.log("📈 Creating propfirms...");

  const propfirms = [
    {
      name: "FTMO",
      displayName: "Forex Trading My Own",
      description: "Forex Trading My Own - Leading prop trading firm",
      website: "https://ftmo.com",
      logoUrl: null,
      isActive: true,
    },
    {
      name: "MyForexFunds",
      displayName: "MyForexFunds Pro",
      description: "Professional forex trading opportunities",
      website: "https://myforexfunds.com",
      logoUrl: null,
      isActive: true,
    },
    {
      name: "The5ers",
      displayName: "The5%ers Elite",
      description: "Elite trading program for skilled traders",
      website: "https://the5ers.com",
      logoUrl: null,
      isActive: true,
    },
  ];

  for (const propfirm of propfirms) {
    await prisma.propfirm.upsert({
      where: { name: propfirm.name },
      update: propfirm,
      create: propfirm,
    });
  }

  console.log("✅ Propfirms created");

  console.log("🏦 Creating brokers...");

  const brokers = [
    {
      name: "MetaTrader 5",
      displayName: "MetaTrader 5 Platform",
      description: "MetaTrader 5 trading platform",
      website: "https://www.metatrader5.com",
      logoUrl: null,
      isActive: true,
    },
    {
      name: "cTrader",
      displayName: "cTrader Platform",
      description: "cTrader trading platform",
      website: "https://ctrader.com",
      logoUrl: null,
      isActive: true,
    },
    {
      name: "TradingView",
      displayName: "TradingView Platform",
      description: "TradingView charting platform",
      website: "https://tradingview.com",
      logoUrl: null,
      isActive: true,
    },
  ];

  for (const broker of brokers) {
    await prisma.broker.upsert({
      where: { name: broker.name },
      update: broker,
      create: broker,
    });
  }

  console.log("✅ Brokers created");

  console.log("📊 Creating symbols...");

  const symbols = [
    {
      symbol: "EURUSD",
      displayName: "Euro vs US Dollar",
      category: "FOREX" as const,
      baseCurrency: "EUR",
      quoteCurrency: "USD",
      pipDecimalPosition: 4,
      isActive: true,
    },
    {
      symbol: "GBPUSD",
      displayName: "British Pound vs US Dollar",
      category: "FOREX" as const,
      baseCurrency: "GBP",
      quoteCurrency: "USD",
      pipDecimalPosition: 4,
      isActive: true,
    },
    {
      symbol: "USDJPY",
      displayName: "US Dollar vs Japanese Yen",
      category: "FOREX" as const,
      baseCurrency: "USD",
      quoteCurrency: "JPY",
      pipDecimalPosition: 3,
      isActive: true,
    },
    {
      symbol: "AUDUSD",
      displayName: "Australian Dollar vs US Dollar",
      category: "FOREX" as const,
      baseCurrency: "AUD",
      quoteCurrency: "USD",
      pipDecimalPosition: 4,
      isActive: true,
    },
    {
      symbol: "USDCAD",
      displayName: "US Dollar vs Canadian Dollar",
      category: "FOREX" as const,
      baseCurrency: "USD",
      quoteCurrency: "CAD",
      pipDecimalPosition: 4,
      isActive: true,
    },
  ];

  for (const symbol of symbols) {
    await prisma.symbol.upsert({
      where: { symbol: symbol.symbol },
      update: symbol,
      create: symbol,
    });
  }

  console.log("✅ Symbols created");

  // Skip additional data for now to align with actual schema
}

// Run seed if this file is executed directly
if (import.meta.main) {
  seedAll()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seed failed:", error);
      process.exit(1);
    });
}
