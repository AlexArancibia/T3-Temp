#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

console.log("🌱 Seeding RBAC system...");

try {
  // Run the TypeScript file with tsx
  execSync("npx tsx src/lib/seedRBAC.ts", {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
  });

  console.log("✅ RBAC seeding completed successfully!");
} catch (error) {
  console.error("❌ RBAC seeding failed:", error.message);
  process.exit(1);
}
