#!/usr/bin/env bun

import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";
import { DEFAULT_ROLES } from "../src/types/rbac";

async function seedAdminUser() {
  console.log("🌱 Creating admin user...");

  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [{ email: "admin@example.com" }, { isAdmin: true }],
      },
    });

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists:", existingAdmin.email);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        phone: "+1234567890",
        isConfirmed: true,
        isAdmin: true,
        timezone: "UTC",
        language: "EN",
        theme: "AUTO",
        defaultRiskPercentage: 1.0,
      },
    });

    console.log("✅ Admin user created:", adminUser.email);

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

    // Assign Super Admin role to the admin user
    await prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
        assignedAt: new Date(),
      },
    });

    console.log("✅ Super Admin role assigned to admin user");

    // Get all permissions for the Super Admin role
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId: superAdminRole.id },
      include: { permission: true },
    });

    console.log(`✅ Admin user has ${rolePermissions.length} permissions`);

    console.log("\n🎉 Admin user setup complete!");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: admin123");
    console.log("👑 Role: Super Admin");
    console.log("🔐 Permissions: All permissions");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedAdminUser()
  .then(() => {
    console.log("✅ Admin user seed completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Admin user seed failed:", error);
    process.exit(1);
  });
