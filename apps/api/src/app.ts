import Fastify from "fastify";
import corsPlugin from "./plugins/cors.js";
import sequelizePlugin from "./plugins/sequelize.js";
import authPlugin from "./plugins/auth.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(corsPlugin);
  await app.register(sequelizePlugin);
  await app.register(authPlugin);

  await app.register(healthRoutes, { prefix: "/api/v1" });
  await app.register(authRoutes, { prefix: "/api/v1/auth" });

  return app;
}
