import { describe, expect, it } from "vitest";
import { adminRoles, orderStatuses, paymentStatuses, shipmentStatuses } from "@/lib/constants";

describe("shared constants", () => {
  it("keeps required admin roles available", () => {
    expect(adminRoles).toEqual(["SUPER_ADMIN", "OPERATIONS", "CATALOG"]);
  });

  it("keeps required commerce statuses available", () => {
    expect(orderStatuses).toContain("PENDING_PAYMENT");
    expect(paymentStatuses).toContain("SUCCESS");
    expect(shipmentStatuses).toContain("DELIVERED");
  });
});
