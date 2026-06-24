#!/usr/bin/env node
/**
 * Create or reset the admin user from ADMIN_EMAIL + ADMIN_PASSWORD in .env
 * Usage: npm run admin:ensure
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { getDb, upsertAdmin } = require("../db");

const email = process.env.ADMIN_EMAIL || "admin@apolloauto.us";
const password = process.env.ADMIN_PASSWORD;

if (!password) {
  console.error("ADMIN_PASSWORD is not set in .env");
  process.exit(1);
}

try {
  getDb();
  const result = upsertAdmin(email, password);
  if (result.created) {
    console.log(`Created admin user: ${result.email}`);
  } else {
    console.log(`Updated password for: ${result.email}`);
  }
} catch (err) {
  console.error(err.message);
  console.error("\nIf you see a better-sqlite3 error, run: nvm use && npm run rebuild:native");
  process.exit(1);
}
