import { prisma } from "./prisma";

export async function getDbSettings(): Promise<Record<string, string>> {
  const settings = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}

export async function getDbSettingByKey(key: string): Promise<string | null> {
  const setting = await prisma.setting.findUnique({
    where: { key },
  });
  return setting ? setting.value : null;
}

export async function updateDbSettings(settingsMap: Record<string, string>) {
  const updates = Object.entries(settingsMap).map(([key, value]) =>
    prisma.setting.upsert({
      where: { key },
      create: {
        key,
        value: String(value),
        updatedAt: new Date(),
      },
      update: {
        value: String(value),
        updatedAt: new Date(),
      },
    })
  );

  await prisma.$transaction(updates);
  return await getDbSettings();
}
