import type { Sequelize, Model, ModelStatic } from "sequelize";
import { DataTypes } from "sequelize";
import type { TaskPriority, TaskStatus } from "@orbit/shared";

export interface TaskAttributes {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCreationAttributes = Omit<TaskAttributes, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<TaskAttributes, "description" | "status" | "priority" | "dueDate" | "sortOrder">>;

export type TaskModel = Model<TaskAttributes, TaskCreationAttributes> & TaskAttributes;

export function defineTaskModel(sequelize: Sequelize): ModelStatic<TaskModel> {
  return sequelize.define<TaskModel>(
    "Task",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "project_id",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("todo", "in_progress", "done"),
        allowNull: false,
        defaultValue: "todo",
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: false,
        defaultValue: "medium",
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "due_date",
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
      tableName: "tasks",
      underscored: true,
      timestamps: true,
    },
  );
}
