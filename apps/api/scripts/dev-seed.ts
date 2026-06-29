/**
 * Dev-only helper: create a demo user with a personal workspace.
 *
 * Usage (from repo root):
 *   pnpm --filter @orbit/api db:migrate
 *   pnpm --filter @orbit/api dev:seed
 */
import "dotenv/config";
import { Sequelize } from "sequelize";
import { initModels } from "../src/models/index.js";
import { createDefaultPersonalWorkspace } from "../src/lib/default-workspace.js";
import { hashPassword } from "../src/lib/password.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sequelize = new Sequelize(databaseUrl, { dialect: "postgres", logging: false });
const models = initModels(sequelize);

const DEMO_EMAIL = "demo@orbit.app";
const DEMO_PASSWORD = "demo1234";

async function main() {
  await sequelize.authenticate();

  let user = await models.User.findOne({ where: { email: DEMO_EMAIL } });
  if (!user) {
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    user = await models.User.create({
      email: DEMO_EMAIL,
      passwordHash,
      name: "Demo User",
    });
    console.log("Created demo user:", user.id);
  } else {
    console.log("Using existing demo user:", user.id);
  }

  const workspace = await createDefaultPersonalWorkspace(models, user.id);
  console.log("Personal workspace:", workspace.id);

  console.log("\nSign in at http://localhost:5173/login");
  console.log(`  Email:    ${DEMO_EMAIL}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);

  await sequelize.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
