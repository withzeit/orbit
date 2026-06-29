import type { Sequelize, ModelStatic } from "sequelize";
import { initUserModel, User } from "./user.js";
import { defineWorkspaceModel, type WorkspaceModel } from "./workspace.js";
import { defineProjectModel, type ProjectModel } from "./project.js";
import { defineTaskModel, type TaskModel } from "./task.js";

export type OrbitModels = {
  User: typeof User;
  Workspace: ModelStatic<WorkspaceModel>;
  Project: ModelStatic<ProjectModel>;
  Task: ModelStatic<TaskModel>;
};

export function initModels(sequelize: Sequelize): OrbitModels {
  const UserModel = initUserModel(sequelize);
  const Workspace = defineWorkspaceModel(sequelize);
  const Project = defineProjectModel(sequelize);
  const Task = defineTaskModel(sequelize);

  UserModel.hasMany(Workspace, { foreignKey: "userId", as: "workspaces" });
  Workspace.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

  Workspace.hasMany(Project, { foreignKey: "workspaceId", as: "projects" });
  Project.belongsTo(Workspace, { foreignKey: "workspaceId", as: "workspace" });

  Project.hasMany(Task, { foreignKey: "projectId", as: "tasks" });
  Task.belongsTo(Project, { foreignKey: "projectId", as: "project" });

  UserModel.hasMany(Task, { foreignKey: "userId", as: "tasks" });
  Task.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

  return {
    User: UserModel,
    Workspace,
    Project,
    Task,
  };
}

export { User };
