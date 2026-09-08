import { prisma } from '@/lib/db/prisma';
import { getDefaultCommitMessage } from './commit-messages';
import { sanitizeAuditData } from './sanitize';

// Generic type for Prisma client or Transaction client that supports activityLog.create
export type PrismaTransactionClient = {
  activityLog: {
    create: (args: {
      data: {
        adminUserId?: string | null;
        adminEmail: string;
        action: string;
        module: string;
        entityType: string;
        entityId?: string | null;
        entityName?: string | null;
        commitNote: string;
        isCustomCommit: boolean;
        beforeData?: unknown;
        afterData?: unknown;
        transactionStatus?: string;
      };
    }) => Promise<unknown>;
  };
};

export interface LogAdminActivityParams {
  tx?: PrismaTransactionClient;
  adminUserId?: string | null;
  adminEmail?: string;
  module: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  entityName?: string | null;
  commitNote?: string | null;
  beforeData?: unknown;
  afterData?: unknown;
  transactionStatus?: string;
}

export interface FieldDiff {
  field: string;
  label: string;
  beforeValue: string | number | boolean | null;
  afterValue: string | number | boolean | null;
}

/**
 * Creates an append-only ActivityLog record within a transaction or standalone prisma client.
 */
export async function logAdminActivity({
  tx,
  adminUserId,
  adminEmail,
  module,
  action,
  entityType,
  entityId,
  entityName,
  commitNote,
  beforeData,
  afterData,
  transactionStatus = 'COMMITTED',
}: LogAdminActivityParams) {
  const client = tx || (prisma as unknown as PrismaTransactionClient);

  const trimmedNote = commitNote ? commitNote.trim() : '';
  const isCustomCommit = trimmedNote.length > 0;
  const resolvedCommitNote = isCustomCommit
    ? trimmedNote
    : getDefaultCommitMessage(module, action, entityName);

  const safeBefore = beforeData ? sanitizeAuditData(beforeData) : null;
  const safeAfter = afterData ? sanitizeAuditData(afterData) : null;
  const safeAdminEmail = adminEmail && adminEmail.trim() ? adminEmail.trim() : 'admin@boxcare.in';

  return client.activityLog.create({
    data: {
      adminUserId: adminUserId || null,
      adminEmail: safeAdminEmail,
      action: action.toUpperCase(),
      module: module.toUpperCase(),
      entityType,
      entityId: entityId || null,
      entityName: entityName || null,
      commitNote: resolvedCommitNote,
      isCustomCommit,
      beforeData: safeBefore as object,
      afterData: safeAfter as object,
      transactionStatus,
    },
  });
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  title: 'Title',
  subtitle: 'Subtitle',
  description: 'Description',
  slug: 'Slug',
  status: 'Status',
  isActive: 'Active Status',
  isFeatured: 'Featured',
  sortOrder: 'Sort Order',
  sellingPricePaise: 'Selling Price',
  mrpPaise: 'MRP',
  stockQuantity: 'Stock Quantity',
  material: 'Material',
  packQuantity: 'Pack Quantity',
  sku: 'SKU',
  lengthIn: 'Length (in)',
  widthIn: 'Width (in)',
  heightIn: 'Height (in)',
  code: 'Coupon Code',
  discountType: 'Discount Type',
  discountValue: 'Discount Value',
  minOrderPaise: 'Minimum Order Value',
  maxDiscountPaise: 'Maximum Discount Value',
  usageLimit: 'Usage Limit',
  usedCount: 'Used Count',
  paymentStatus: 'Payment Status',
  shipmentStatus: 'Shipment Status',
  courierPartner: 'Courier Partner',
  trackingNumber: 'Tracking Number',
  trackingUrl: 'Tracking URL',
  notes: 'Notes',
  location: 'Location',
  destination: 'Destination',
  type: 'Item Type',
  label: 'Label',
  imageUrl: 'Image URL',
  seoTitle: 'SEO Title',
  seoDescription: 'SEO Description',
  value: 'Setting Value',
};

function formatValue(field: string, val: unknown): string | number | boolean | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'number') {
    if (field.endsWith('Paise') || field.includes('Price') || field.includes('Fee') || field.includes('Discount') || field.includes('Total') || field.includes('Tax') || field.includes('subtotal')) {
      return `₹${(val / 100).toFixed(val % 100 === 0 ? 0 : 2)}`;
    }
    return val;
  }
  if (typeof val === 'string') {
    return val;
  }
  if (Array.isArray(val)) {
    return `[${val.length} items]`;
  }
  return JSON.stringify(val);
}

/**
 * Computes human-friendly field differences between before and after records.
 */
export function computeFieldDiffs(before: unknown, after: unknown): FieldDiff[] {
  if (!before || !after || typeof before !== 'object' || typeof after !== 'object') {
    return [];
  }

  const beforeObj = before as Record<string, unknown>;
  const afterObj = after as Record<string, unknown>;
  const allKeys = Array.from(new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]));

  const ignoredKeys = new Set(['id', 'createdAt', 'updatedAt', 'productId', 'categoryId', 'orderId', 'customerId', 'userId', 'sessionId']);
  const diffs: FieldDiff[] = [];

  for (const key of allKeys) {
    if (ignoredKeys.has(key)) continue;

    const bVal = beforeObj[key];
    const aVal = afterObj[key];

    // Check if values are actually different
    const bStr = JSON.stringify(bVal);
    const aStr = JSON.stringify(aVal);

    if (bStr !== aStr) {
      diffs.push({
        field: key,
        label: FIELD_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1),
        beforeValue: formatValue(key, bVal),
        afterValue: formatValue(key, aVal),
      });
    }
  }

  return diffs;
}
