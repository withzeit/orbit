import type { Sequelize } from "sequelize";
import { initUserModel, User } from "./user.js";

export type OrbitModels = {
  User: typeof User;
};

export function initModels(sequelize: Sequelize): OrbitModels {
  const UserModel = initUserModel(sequelize);
  return { User: UserModel };
}

export { User };
