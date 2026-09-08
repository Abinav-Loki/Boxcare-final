"use server";

import { getDbDashboardMetrics } from "@/lib/db/dashboard";

export async function getAdminDashboardMetricsAction() {
  try {
    const metrics = await getDbDashboardMetrics();
    return { success: true, data: metrics };
  } catch (error: any) {
    console.error("Error fetching dashboard metrics:", error);
    return { success: false, error: error.message || "Failed to fetch dashboard metrics" };
  }
}
