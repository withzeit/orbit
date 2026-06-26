import fp from "fastify-plugin";
import { Sequelize } from "sequelize";
import type { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

declare module "fastify" {
  interface FastifyInstance {
    sequelize: Sequelize;
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

  fastify.decorate("sequelize", sequelize);

  fastify.addHook("onClose", async () => {
    await sequelize.close();
  });
});
