import { prisma } from "./prisma";
import { NavigationLocation, NavigationItemType } from "@/generated/prisma/client";

export async function getDbNavigationItems(location?: NavigationLocation) {
  const where: any = {};
  if (location) {
    where.location = location;
  }
  return await prisma.navigationItem.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  });
}

export interface CreateNavigationItemInput {
  label: string;
  location: NavigationLocation;
  type: NavigationItemType;
  destination: string;
  sortOrder?: number;
  isActive?: boolean;
}

export async function createDbNavigationItem(input: CreateNavigationItemInput) {
  return await prisma.navigationItem.create({
    data: {
      label: input.label,
      location: input.location,
      type: input.type,
      destination: input.destination,
      sortOrder: input.sortOrder || 0,
      isActive: input.isActive !== undefined ? input.isActive : true,
    },
  });
}

export async function updateDbNavigationItem(id: string, input: Partial<CreateNavigationItemInput>) {
  return await prisma.navigationItem.update({
    where: { id },
    data: {
      label: input.label,
      location: input.location,
      type: input.type,
      destination: input.destination,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
    },
  });
}

export async function deleteDbNavigationItem(id: string) {
  return await prisma.navigationItem.delete({
    where: { id },
  });
}

export async function reorderDbNavigationItems(items: { id: string; sortOrder: number }[]) {
  const updates = items.map((item) =>
    prisma.navigationItem.update({
      where: { id: item.id },
      data: { sortOrder: item.sortOrder },
    })
  );
  return await prisma.$transaction(updates);
}
