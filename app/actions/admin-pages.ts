"use server";

import { safeRevalidatePath as revalidatePath } from "@/lib/utils/revalidate";
import { prisma } from "@/lib/db/prisma";
import { pageContentSchema } from "@/lib/validation/page";
import { getDbPages } from "@/lib/db/pages";
import { logAdminActivity } from "@/lib/audit/activity-logger";

export async function getAdminPagesAction() {
  try {
    const pages = await getDbPages();
    return { success: true, data: pages };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load pages";
    return { success: false, error: errorMsg };
  }
}

export async function updateAdminPageAction(slug: string, rawInput: unknown, commitNote?: string) {
  try {
    const normalizedSlug = (slug || "home").trim().replace(/^\/+|\/+$/g, "") || "home";
    const schema = pageContentSchema.partial();
    const validated = schema.parse(rawInput);

    const existing = await prisma.pageContent.findUnique({
      where: { slug: normalizedSlug },
    });

    const beforeSnapshot = existing
      ? {
          id: existing.id,
          slug: existing.slug,
          title: existing.title,
          content: existing.content,
          seoTitle: existing.seoTitle,
          seoDescription: existing.seoDescription,
          isActive: existing.isActive,
        }
      : null;

    const updated = await prisma.$transaction(async (tx) => {
      const page = await tx.pageContent.upsert({
        where: { slug: normalizedSlug },
        update: {
          title: validated.title !== undefined ? validated.title : undefined,
          content: validated.content !== undefined ? validated.content : undefined,
          seoTitle: validated.seoTitle !== undefined ? validated.seoTitle : undefined,
          seoDescription: validated.seoDescription !== undefined ? validated.seoDescription : undefined,
          isActive: validated.isActive !== undefined ? validated.isActive : undefined,
        },
        create: {
          slug: normalizedSlug,
          title: validated.title || normalizedSlug,
          content: validated.content || "",
          seoTitle: validated.seoTitle || null,
          seoDescription: validated.seoDescription || null,
          isActive: validated.isActive !== undefined ? validated.isActive : true,
        },
      });

      const afterSnapshot = {
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        isActive: page.isActive,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "PAGES",
        action: "UPDATE",
        entityType: "PageContent",
        entityId: page.id,
        entityName: page.title,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return page;
    });

    revalidatePath("/admin/pages");
    revalidatePath("/admin/activity");
    revalidatePath(`/${slug}`);
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update page";
    return { success: false, error: errorMsg };
  }
}
