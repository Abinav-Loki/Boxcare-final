"use client";

import React from "react";
import Link from "next/link";

export function OperationsHub() {
  const alerts = [
    {
      id: "pending-payments",
      type: "warning",
      title: "3 Payments Awaiting Verification",
      description: "CCAvenue test transactions or pending bank confirmations requiring manual review.",
      actionText: "Verify Orders",
      href: "/admin/orders?status=PENDING_PAYMENT",
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      id: "ready-to-ship",
      type: "info",
      title: "8 Orders Ready for Dispatch",
      description: "Packed boxes awaiting carrier pickup and shipment tracking ID entry.",
      actionText: "Print Labels / Ship",
      href: "/admin/shipments",
      icon: (
        <svg className="w-5 h-5 text-[#5B3A29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      badgeColor: "bg-[#F7F2EC] text-[#5B3A29] border-[#E5D8C8]",
    },
    {
      id: "low-stock",
      type: "danger",
      title: "2 Products Low in Stock",
      description: "Mailer boxes running below 250 units reorder threshold in inventory.",
      actionText: "Restock Now",
      href: "/admin/products?filter=low_stock",
      icon: (
        <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-white rounded-xl p-4 border border-[#E5D8C8] shadow-xs hover:border-[#D68A45]/60 transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="p-2 rounded-lg bg-[#F7F3ED]">
                {alert.icon}
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${alert.badgeColor}`}>
                Action Needed
              </span>
            </div>
            <h3 className="font-bold text-xs text-[#24201D] mt-3">
              {alert.title}
            </h3>
            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
              {alert.description}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F2EAE0]">
            <Link
              href={alert.href}
              className="text-xs font-bold text-[#5B3A29] hover:text-[#D68A45] inline-flex items-center gap-1 transition"
            >
              <span>{alert.actionText}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
