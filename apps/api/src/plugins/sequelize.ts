import fp from "fastify-plugin";
import { Sequelize } from "sequelize";
import type { FastifyInstance } from "fastify";
import { env } from "../config/env.js";
import { initModels, type OrbitModels } from "../models/index.js";

declare module "fastify" {
  interface FastifyInstance {
    sequelize: Sequelize;
    models: OrbitModels;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const sequelize = new Sequelize(env.databaseUrl, {
    dialect: "postgres",
    logging: env.nodeEnv === "development" ? console.log : false,
    dialectOptions: env.databaseSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,
  });

  const models = initModels(sequelize);

  fastify.decorate("sequelize", sequelize);
  fastify.decorate("models", models);

  fastify.addHook("onClose", async () => {
    await sequelize.close();
  });
});
