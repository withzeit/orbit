import type { Sequelize, ModelStatic } from "sequelize";
import { initUserModel, User } from "./user.js";
import { defineWorkspaceModel, type WorkspaceModel } from "./workspace.js";
import { defineProjectModel, type ProjectModel } from "./project.js";

export type OrbitModels = {
  User: typeof User;
  Workspace: ModelStatic<WorkspaceModel>;
  Project: ModelStatic<ProjectModel>;
};

export function initModels(sequelize: Sequelize): OrbitModels {
  const UserModel = initUserModel(sequelize);
  const Workspace = defineWorkspaceModel(sequelize);
  const Project = defineProjectModel(sequelize);

  UserModel.hasMany(Workspace, { foreignKey: "userId", as: "workspaces" });
  Workspace.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

  Workspace.hasMany(Project, { foreignKey: "workspaceId", as: "projects" });
  Project.belongsTo(Workspace, { foreignKey: "workspaceId", as: "workspace" });

  return {
    User: UserModel,
    Workspace,
    Project,
  };
}

export { User };
