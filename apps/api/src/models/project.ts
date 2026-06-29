import type { Sequelize, Model, ModelStatic, Optional } from "sequelize";
import { DataTypes } from "sequelize";

export interface ProjectAttributes {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectCreationAttributes = Optional<
  ProjectAttributes,
  "id" | "createdAt" | "updatedAt" | "sortOrder"
>;

export type ProjectModel = Model<ProjectAttributes, ProjectCreationAttributes> & ProjectAttributes;

export function defineProjectModel(sequelize: Sequelize): ModelStatic<ProjectModel> {
  return sequelize.define<ProjectModel>(
    "Project",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      workspaceId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "workspace_id",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "sort_order",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      tableName: "projects",
      underscored: true,
      timestamps: true,
    },
  );
}
