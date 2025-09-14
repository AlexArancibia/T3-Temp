#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
