"use strict";

const bcrypt = require("bcrypt");

const DEMO_USER_ID = "00000000-0000-4000-8000-000000000001";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const now = new Date();
    const passwordHash = await bcrypt.hash("demo1234", 10);

    await queryInterface.bulkInsert("users", [
      {
        id: DEMO_USER_ID,
        email: "demo@orbit.app",
        password_hash: passwordHash,
        name: "Demo User",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", { email: "demo@orbit.app" });
  },
};
