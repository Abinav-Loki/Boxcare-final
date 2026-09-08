import { prisma } from "./prisma";

export async function getDbBanners(location?: string) {
  const where: any = {};
  if (location && location !== "ALL") {
    where.location = location;
  }
  return await prisma.banner.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  });
}

export interface CreateBannerInput {
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  location?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export async function createDbBanner(input: CreateBannerInput) {
  return await prisma.banner.create({
    data: {
      title: input.title,
      subtitle: input.subtitle || null,
      imageUrl: input.imageUrl,
      linkUrl: input.linkUrl || null,
      location: input.location || "HOME_HERO",
      sortOrder: input.sortOrder || 0,
      isActive: input.isActive !== undefined ? input.isActive : true,
    },
  });
}

export async function updateDbBanner(id: string, input: Partial<CreateBannerInput>) {
  return await prisma.banner.update({
    where: { id },
    data: {
      title: input.title,
      subtitle: input.subtitle !== undefined ? input.subtitle : undefined,
      imageUrl: input.imageUrl,
      linkUrl: input.linkUrl !== undefined ? input.linkUrl : undefined,
      location: input.location,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
    },
  });
}

export async function deleteDbBanner(id: string) {
  return await prisma.banner.delete({
    where: { id },
  });
}

export async function toggleDbBannerActive(id: string, isActive: boolean) {
  return await prisma.banner.update({
    where: { id },
    data: { isActive },
  });
}
