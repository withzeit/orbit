import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
    };
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      type: "access" | "refresh";
    };
    user: {
      id: string;
    };
  }
}
