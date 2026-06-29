import type { OrbitModels } from "../models/index.js";
import { slugify } from "./slugify.js";

export async function uniqueWorkspaceSlug(
  models: OrbitModels,
  userId: string,
  baseSlug: string,
): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;

  while (
    await models.Workspace.findOne({
      where: { userId, slug },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createDefaultPersonalWorkspace(
  models: OrbitModels,
  userId: string,
) {
  const existing = await models.Workspace.findOne({
    where: { userId, type: "personal" },
  });

  if (existing) {
    return existing;
  }

  const slug = await uniqueWorkspaceSlug(models, userId, slugify("Personal"));

  return models.Workspace.create({
    userId,
    name: "Personal",
    slug,
    type: "personal",
  });
}
