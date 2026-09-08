import { prisma } from "./prisma";

export async function getDbPages() {
  return await prisma.pageContent.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function getDbPageBySlug(slug: string) {
  return await prisma.pageContent.findUnique({
    where: { slug },
  });
}

export interface UpdatePageContentInput {
  title?: string;
  content?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isActive?: boolean;
}

export async function updateDbPageContent(slug: string, input: UpdatePageContentInput) {
  return await prisma.pageContent.upsert({
    where: { slug },
    create: {
      slug,
      title: input.title || slug,
      content: input.content || "{}",
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      isActive: input.isActive !== undefined ? input.isActive : true,
    },
    update: {
      title: input.title,
      content: input.content,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      isActive: input.isActive,
    },
  });
}
