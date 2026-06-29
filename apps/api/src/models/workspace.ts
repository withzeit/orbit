import type { Sequelize, Model, ModelStatic, Optional } from "sequelize";
import { DataTypes } from "sequelize";

export type WorkspaceType = "personal" | "business" | "custom";

export interface WorkspaceAttributes {
  id: string;
  userId: string;
  name: string;
  slug: string;
  type: WorkspaceType;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkspaceCreationAttributes = Optional<
  WorkspaceAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export type WorkspaceModel = Model<WorkspaceAttributes, WorkspaceCreationAttributes> &
  WorkspaceAttributes;

export function defineWorkspaceModel(sequelize: Sequelize): ModelStatic<WorkspaceModel> {
  return sequelize.define<WorkspaceModel>(
    "Workspace",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("personal", "business", "custom"),
        allowNull: false,
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
      tableName: "workspaces",
      underscored: true,
      timestamps: true,
    },
  );
}
