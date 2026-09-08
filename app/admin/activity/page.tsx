import React from "react";
import { ActivityHistoryManager } from "@/components/admin/activity/activity-history-manager";

export const metadata = {
  title: "Activity History | Box Care Admin",
  description: "Audit trail and change commits of database modifications performed by administrators.",
};

export default function AdminActivityPage() {
  return <ActivityHistoryManager />;
}
