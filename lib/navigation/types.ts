export const navigationLocations = [
  "HEADER",
  "FOOTER",
  "CATEGORY_MENU",
  "MOBILE",
  "FEATURED",
] as const;

export const navigationItemTypes = [
  "CATEGORY",
  "PRODUCT",
  "PAGE",
  "POLICY",
  "CUSTOM_URL",
] as const;

export type NavigationLocation = (typeof navigationLocations)[number];
export type NavigationItemType = (typeof navigationItemTypes)[number];
