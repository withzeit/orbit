import { z } from "zod";

export const workspaceTypeSchema = z.enum(["personal", "business", "custom"]);

export const workspaceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  type: workspaceTypeSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(100),
  type: workspaceTypeSchema.optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
});

export const updateWorkspaceSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    type: workspaceTypeSchema.optional(),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const workspaceListSchema = z.array(workspaceSchema);

export type WorkspaceType = z.infer<typeof workspaceTypeSchema>;
export type Workspace = z.infer<typeof workspaceSchema>;
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
