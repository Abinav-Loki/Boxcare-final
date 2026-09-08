export type AuditModule =
  | 'PRODUCTS'
  | 'CATEGORIES'
  | 'NAVIGATION'
  | 'BANNERS'
  | 'PAGES'
  | 'COUPONS'
  | 'ORDERS'
  | 'SHIPMENTS'
  | 'SETTINGS';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'REORDER'
  | 'ACTIVATE'
  | 'DEACTIVATE'
  | 'STATUS_CHANGE'
  | 'PUBLISH'
  | 'UNPUBLISH';

const DEFAULT_COMMIT_MAP: Record<string, string> = {
  // Products
  'PRODUCTS:CREATE': 'Product created',
  'PRODUCTS:UPDATE': 'Product updated',
  'PRODUCTS:DELETE': 'Product deleted',
  'PRODUCTS:ACTIVATE': 'Product activated',
  'PRODUCTS:DEACTIVATE': 'Product deactivated',
  'PRODUCTS:STATUS_CHANGE': 'Product status changed',

  // Categories
  'CATEGORIES:CREATE': 'Category created',
  'CATEGORIES:UPDATE': 'Category updated',
  'CATEGORIES:DELETE': 'Category deleted',
  'CATEGORIES:REORDER': 'Category reordered',
  'CATEGORIES:ACTIVATE': 'Category activated',
  'CATEGORIES:DEACTIVATE': 'Category deactivated',
  'CATEGORIES:STATUS_CHANGE': 'Category status changed',

  // Navigation
  'NAVIGATION:CREATE': 'Navigation item created',
  'NAVIGATION:UPDATE': 'Navigation item updated',
  'NAVIGATION:DELETE': 'Navigation item deleted',
  'NAVIGATION:REORDER': 'Navigation item reordered',

  // Banners
  'BANNERS:CREATE': 'Banner created',
  'BANNERS:UPDATE': 'Banner updated',
  'BANNERS:DELETE': 'Banner deleted',
  'BANNERS:PUBLISH': 'Banner published',
  'BANNERS:UNPUBLISH': 'Banner unpublished',

  // Pages
  'PAGES:CREATE': 'Page created',
  'PAGES:UPDATE': 'Page updated',
  'PAGES:DELETE': 'Page deleted',
  'PAGES:PUBLISH': 'Page published',
  'PAGES:UNPUBLISH': 'Page unpublished',

  // Coupons
  'COUPONS:CREATE': 'Coupon created',
  'COUPONS:UPDATE': 'Coupon updated',
  'COUPONS:DELETE': 'Coupon deleted',
  'COUPONS:ACTIVATE': 'Coupon activated',
  'COUPONS:DEACTIVATE': 'Coupon deactivated',
  'COUPONS:STATUS_CHANGE': 'Coupon status changed',

  // Orders
  'ORDERS:STATUS_CHANGE': 'Order status changed',
  'ORDERS:UPDATE': 'Order updated',

  // Shipments
  'SHIPMENTS:STATUS_CHANGE': 'Shipment status changed',
  'SHIPMENTS:UPDATE': 'Shipment updated',

  // Settings
  'SETTINGS:UPDATE': 'Setting updated',
  'SETTINGS:CREATE': 'Setting created',
};

/**
 * Returns a standardized default commit note for server-side audit logs.
 */
export function getDefaultCommitMessage(
  module: string,
  action: string,
  _entityName?: string | null
): string {
  const normalizedModule = module.trim().toUpperCase();
  const normalizedAction = action.trim().toUpperCase();
  const key = `${normalizedModule}:${normalizedAction}`;

  return DEFAULT_COMMIT_MAP[key] || 'Admin change completed';
}
