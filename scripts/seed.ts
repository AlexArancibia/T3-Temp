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

    // 2. Seed Admin User
    console.log("\n👤 Step 2: Seeding admin user...");
    await seedAdminUser();

    // 3. Seed Trading Data
    console.log("\n📊 Step 3: Seeding trading data...");
    await seedTradingData();

    console.log("\n🎉 Complete database seed finished successfully!");
    console.log("\n📧 Admin credentials:");
    console.log("   Email: admin@example.com");
    console.log("   Password: admin123");
    console.log("   Role: Super Administrator");
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

async function seedAdminUser() {
  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: "admin@example.com",
    },
  });

  if (existingAdmin) {
    console.log("⚠️ Admin user already exists:", existingAdmin.email);

    // Check if user has Super Admin role
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: existingAdmin.id,
      },
      include: {
        role: true,
      },
    });

    const hasSuperAdminRole = userRoles.some(
      (ur) => ur.role.name === DEFAULT_ROLES.SUPER_ADMIN,
    );

    if (hasSuperAdminRole) {
      console.log("✅ Admin user already has Super Admin role");
      return;
    }

    // Fix the role
    console.log("🔧 Fixing admin user role...");

    // Remove existing roles
    await prisma.userRole.deleteMany({
      where: {
        userId: existingAdmin.id,
      },
    });

    // Get the Super Admin role
    const superAdminRole = await prisma.role.findUnique({
      where: { name: DEFAULT_ROLES.SUPER_ADMIN },
    });

    if (!superAdminRole) {
      console.log(
        "❌ Super Admin role not found. Please run the RBAC seed first.",
      );
      return;
    }

    // Assign Super Admin role
    await prisma.userRole.create({
      data: {
        userId: existingAdmin.id,
        roleId: superAdminRole.id,
        assignedAt: new Date(),
      },
    });

    console.log("✅ Super Admin role assigned to existing admin user");
    return;
  }

  // Create admin user with Better Auth schema
  const adminUser = await prisma.user.create({
    data: {
      id: "admin-user-id",
      name: "Admin User",
      email: "admin@example.com",
      emailVerified: true,
    },
  });

  // Create account for admin user (Better Auth requires this)
  await prisma.account.create({
    data: {
      id: "admin-account-id",
      userId: adminUser.id,
      accountId: adminUser.id,
      providerId: "credential",
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJpJRGm5iJ2L2/2T2iK", // admin123
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Get the Super Admin role
  const superAdminRole = await prisma.role.findUnique({
    where: { name: DEFAULT_ROLES.SUPER_ADMIN },
  });

  if (!superAdminRole) {
    console.log(
      "❌ Super Admin role not found. Please run the RBAC seed first.",
    );
    return;
  }

  // Assign Super Admin role to admin user
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
      assignedAt: new Date(),
    },
  });

  console.log("✅ Admin user created with Super Admin role");
}

async function seedTradingData() {
  console.log("📈 Creating propfirms...");

  const propfirms = [
    {
      id: "propfirm-1",
      name: "FTMO",
      description: "Forex Trading My Own - Leading prop trading firm",
      website: "https://ftmo.com",
      maxAccountSize: 400000,
      profitSplit: 90,
      isActive: true,
    },
    {
      id: "propfirm-2",
      name: "MyForexFunds",
      description: "Professional forex trading opportunities",
      website: "https://myforexfunds.com",
      maxAccountSize: 200000,
      profitSplit: 85,
      isActive: true,
    },
    {
      id: "propfirm-3",
      name: "The5ers",
      description: "Elite trading program for skilled traders",
      website: "https://the5ers.com",
      maxAccountSize: 1000000,
      profitSplit: 80,
      isActive: true,
    },
  ];

  for (const propfirm of propfirms) {
    await prisma.propfirm.upsert({
      where: { id: propfirm.id },
      update: propfirm,
      create: propfirm,
    });
  }

  console.log("✅ Propfirms created");

  console.log("🏦 Creating brokers...");

  const brokers = [
    {
      id: "broker-1",
      name: "MetaTrader 5",
      description: "MetaTrader 5 trading platform",
      website: "https://www.metatrader5.com",
      isActive: true,
    },
    {
      id: "broker-2",
      name: "cTrader",
      description: "cTrader trading platform",
      website: "https://ctrader.com",
      isActive: true,
    },
    {
      id: "broker-3",
      name: "TradingView",
      description: "TradingView charting platform",
      website: "https://tradingview.com",
      isActive: true,
    },
  ];

  for (const broker of brokers) {
    await prisma.broker.upsert({
      where: { id: broker.id },
      update: broker,
      create: broker,
    });
  }

  console.log("✅ Brokers created");

  console.log("📊 Creating symbols...");

  const symbols = [
    {
      id: "symbol-1",
      name: "EURUSD",
      description: "Euro vs US Dollar",
      category: "Forex",
      isActive: true,
    },
    {
      id: "symbol-2",
      name: "GBPUSD",
      description: "British Pound vs US Dollar",
      category: "Forex",
      isActive: true,
    },
    {
      id: "symbol-3",
      name: "USDJPY",
      description: "US Dollar vs Japanese Yen",
      category: "Forex",
      isActive: true,
    },
    {
      id: "symbol-4",
      name: "AUDUSD",
      description: "Australian Dollar vs US Dollar",
      category: "Forex",
      isActive: true,
    },
    {
      id: "symbol-5",
      name: "USDCAD",
      description: "US Dollar vs Canadian Dollar",
      category: "Forex",
      isActive: true,
    },
    {
      id: "symbol-6",
      name: "NZDUSD",
      description: "New Zealand Dollar vs US Dollar",
      category: "Forex",
      isActive: true,
    },
    {
      id: "symbol-7",
      name: "EURGBP",
      description: "Euro vs British Pound",
      category: "Forex",
      isActive: true,
    },
    {
      id: "symbol-8",
      name: "EURJPY",
      description: "Euro vs Japanese Yen",
      category: "Forex",
      isActive: true,
    },
    {
      id: "symbol-9",
      name: "GBPJPY",
      description: "British Pound vs Japanese Yen",
      category: "Forex",
      isActive: true,
    },
    {
      id: "symbol-10",
      name: "AUDJPY",
      description: "Australian Dollar vs Japanese Yen",
      category: "Forex",
      isActive: true,
    },
  ];

  for (const symbol of symbols) {
    await prisma.symbol.upsert({
      where: { id: symbol.id },
      update: symbol,
      create: symbol,
    });
  }

  console.log("✅ Symbols created");

  console.log("🎯 Creating phases...");

  const phases = [
    {
      id: "phase-1",
      name: "Phase 1",
      description: "First evaluation phase",
      order: 1,
      isActive: true,
    },
    {
      id: "phase-2",
      name: "Phase 2",
      description: "Second evaluation phase",
      order: 2,
      isActive: true,
    },
    {
      id: "phase-3",
      name: "Live",
      description: "Live trading phase",
      order: 3,
      isActive: true,
    },
  ];

  for (const phase of phases) {
    await prisma.phase.upsert({
      where: { id: phase.id },
      update: phase,
      create: phase,
    });
  }

  console.log("✅ Phases created");

  console.log("💳 Creating account types...");

  const accountTypes = [
    {
      id: "account-type-1",
      name: "Challenge",
      description: "Evaluation challenge account",
      isActive: true,
    },
    {
      id: "account-type-2",
      name: "Live",
      description: "Live trading account",
      isActive: true,
    },
    {
      id: "account-type-3",
      name: "Demo",
      description: "Demo trading account",
      isActive: true,
    },
  ];

  for (const accountType of accountTypes) {
    await prisma.accountType.upsert({
      where: { id: accountType.id },
      update: accountType,
      create: accountType,
    });
  }

  console.log("✅ Account types created");

  console.log("⚙️ Creating symbol configurations...");

  const symbolConfigs = [
    {
      id: "config-1",
      propfirmId: "propfirm-1",
      symbolId: "symbol-1",
      maxDailyLoss: 5.0,
      maxTotalLoss: 10.0,
      maxDailyProfit: 5.0,
      maxTotalProfit: 10.0,
      isActive: true,
    },
    {
      id: "config-2",
      propfirmId: "propfirm-1",
      symbolId: "symbol-2",
      maxDailyLoss: 5.0,
      maxTotalLoss: 10.0,
      maxDailyProfit: 5.0,
      maxTotalProfit: 10.0,
      isActive: true,
    },
    {
      id: "config-3",
      propfirmId: "propfirm-2",
      symbolId: "symbol-1",
      maxDailyLoss: 4.0,
      maxTotalLoss: 8.0,
      maxDailyProfit: 4.0,
      maxTotalProfit: 8.0,
      isActive: true,
    },
  ];

  for (const config of symbolConfigs) {
    await prisma.symbolConfiguration.upsert({
      where: { id: config.id },
      update: config,
      create: config,
    });
  }

  console.log("✅ Symbol configurations created");
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
