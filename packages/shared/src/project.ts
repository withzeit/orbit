import { z } from "zod";

export const projectColorSchema = z
  .string()
  .trim()
  .min(1)
  .max(20)
  .regex(/^#[0-9a-fA-F]{6}$/);

export const projectSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  name: z.string(),
  color: projectColorSchema,
  sortOrder: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  color: projectColorSchema,
  sortOrder: z.number().int().optional(),
});

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    color: projectColorSchema.optional(),
    sortOrder: z.number().int().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const projectListSchema = z.array(projectSchema);

export type Project = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
