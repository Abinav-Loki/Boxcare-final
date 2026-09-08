"use server";

import { prisma } from "@/lib/db/prisma";
import { computeFieldDiffs, FieldDiff } from "@/lib/audit/activity-logger";

export interface ActivityFilterQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  module?: string;
  action?: string;
  transactionStatus?: string;
  startDate?: string;
  endDate?: string;
  isCustomCommit?: boolean;
}

export interface ActivityLogItem {
  id: string;
  adminUserId: string | null;
  adminEmail: string;
  action: string;
  module: string;
  entityType: string;
  entityId: string | null;
  entityName: string | null;
  commitNote: string;
  isCustomCommit: boolean;
  beforeData: unknown;
  afterData: unknown;
  transactionStatus: string;
  createdAt: Date;
}

export interface PaginatedActivitiesResult {
  activities: ActivityLogItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetches paginated activity log records with server-side filtering.
 */
export async function getAdminActivitiesAction(
  query: ActivityFilterQuery = {}
): Promise<{ success: boolean; data?: PaginatedActivitiesResult; error?: string }> {
  try {
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};

    if (query.module && query.module !== 'ALL') {
      where.module = query.module.toUpperCase();
    }

    if (query.action && query.action !== 'ALL') {
      where.action = query.action.toUpperCase();
    }

    if (query.transactionStatus && query.transactionStatus !== 'ALL') {
      where.transactionStatus = query.transactionStatus.toUpperCase();
    }

    if (query.isCustomCommit !== undefined) {
      where.isCustomCommit = query.isCustomCommit;
    }

    if (query.startDate || query.endDate) {
      const createdAtFilter: Record<string, Date> = {};
      if (query.startDate) {
        createdAtFilter.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        createdAtFilter.lte = end;
      }
      where.createdAt = createdAtFilter;
    }

    if (query.search && query.search.trim().length > 0) {
      const searchTerms = query.search.trim();
      where.OR = [
        { commitNote: { contains: searchTerms, mode: 'insensitive' } },
        { entityName: { contains: searchTerms, mode: 'insensitive' } },
        { adminEmail: { contains: searchTerms, mode: 'insensitive' } },
        { entityId: { contains: searchTerms, mode: 'insensitive' } },
      ];
    }

    const [total, rawActivities] = await Promise.all([
      prisma.activityLog.count({ where }),
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    const activities: ActivityLogItem[] = rawActivities.map((a) => ({
      id: a.id,
      adminUserId: a.adminUserId,
      adminEmail: a.adminEmail,
      action: a.action,
      module: a.module,
      entityType: a.entityType,
      entityId: a.entityId,
      entityName: a.entityName,
      commitNote: a.commitNote,
      isCustomCommit: a.isCustomCommit,
      beforeData: a.beforeData,
      afterData: a.afterData,
      transactionStatus: a.transactionStatus,
      createdAt: a.createdAt,
    }));

    return {
      success: true,
      data: {
        activities,
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch activity history';
    return { success: false, error: errorMsg };
  }
}

/**
 * Fetches full details for a single ActivityLog record and computes field diffs.
 */
export async function getAdminActivityDetailsAction(
  id: string
): Promise<{
  success: boolean;
  data?: {
    activity: ActivityLogItem;
    fieldDiffs: FieldDiff[];
  };
  error?: string;
}> {
  try {
    if (!id) {
      return { success: false, error: 'Activity ID is required' };
    }

    const activity = await prisma.activityLog.findUnique({
      where: { id },
    });

    if (!activity) {
      return { success: false, error: 'Activity record not found' };
    }

    const fieldDiffs = computeFieldDiffs(activity.beforeData, activity.afterData);

    return {
      success: true,
      data: {
        activity: {
          id: activity.id,
          adminUserId: activity.adminUserId,
          adminEmail: activity.adminEmail,
          action: activity.action,
          module: activity.module,
          entityType: activity.entityType,
          entityId: activity.entityId,
          entityName: activity.entityName,
          commitNote: activity.commitNote,
          isCustomCommit: activity.isCustomCommit,
          beforeData: activity.beforeData,
          afterData: activity.afterData,
          transactionStatus: activity.transactionStatus,
          createdAt: activity.createdAt,
        },
        fieldDiffs,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch activity details';
    return { success: false, error: errorMsg };
  }
}
