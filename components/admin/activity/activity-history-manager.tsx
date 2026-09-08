"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getAdminActivitiesAction,
  getAdminActivityDetailsAction,
  ActivityLogItem,
  ActivityFilterQuery,
} from "@/app/actions/admin-activity";
import { FieldDiff } from "@/lib/audit/activity-logger";

const MODULE_OPTIONS = [
  { value: "ALL", label: "All Modules" },
  { value: "PRODUCTS", label: "Products" },
  { value: "CATEGORIES", label: "Categories" },
  { value: "NAVIGATION", label: "Navigation" },
  { value: "BANNERS", label: "Banners" },
  { value: "PAGES", label: "Pages" },
  { value: "COUPONS", label: "Coupons" },
  { value: "ORDERS", label: "Orders" },
  { value: "SHIPMENTS", label: "Shipments" },
  { value: "SETTINGS", label: "Settings" },
];

const ACTION_OPTIONS = [
  { value: "ALL", label: "All Actions" },
  { value: "CREATE", label: "Create" },
  { value: "UPDATE", label: "Update" },
  { value: "DELETE", label: "Delete" },
  { value: "ACTIVATE", label: "Activate" },
  { value: "DEACTIVATE", label: "Deactivate" },
  { value: "STATUS_CHANGE", label: "Status Change" },
  { value: "PUBLISH", label: "Publish" },
  { value: "UNPUBLISH", label: "Unpublish" },
  { value: "REORDER", label: "Reorder" },
];

export function ActivityHistoryManager() {
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState("ALL");
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [commitFilter, setCommitFilter] = useState<"ALL" | "CUSTOM" | "DEFAULT">("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Drawer / Details Modal
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [detailActivity, setDetailActivity] = useState<ActivityLogItem | null>(null);
  const [detailDiffs, setDetailDiffs] = useState<FieldDiff[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query: ActivityFilterQuery = {
        page,
        pageSize,
        search: search.trim() || undefined,
        module: selectedModule !== "ALL" ? selectedModule : undefined,
        action: selectedAction !== "ALL" ? selectedAction : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        isCustomCommit: commitFilter === "CUSTOM" ? true : commitFilter === "DEFAULT" ? false : undefined,
      };

      const res = await getAdminActivitiesAction(query);
      if (res.success && res.data) {
        setActivities(res.data.activities);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      } else {
        setError(res.error || "Failed to load activity logs");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error fetching activity logs";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, selectedModule, selectedAction, commitFilter, startDate, endDate]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleOpenDetails = async (id: string) => {
    setSelectedActivityId(id);
    setIsLoadingDetails(true);
    try {
      const res = await getAdminActivityDetailsAction(id);
      if (res.success && res.data) {
        setDetailActivity(res.data.activity);
        setDetailDiffs(res.data.fieldDiffs);
      }
    } catch {
      // Handled gracefully
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedActivityId(null);
    setDetailActivity(null);
    setDetailDiffs([]);
  };

  const handleResetFilters = () => {
    setPage(1);
    setSearch("");
    setSelectedModule("ALL");
    setSelectedAction("ALL");
    setCommitFilter("ALL");
    setStartDate("");
    setEndDate("");
  };

  const getActionBadgeStyle = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE")) {
      return { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" };
    }
    if (act.includes("DELETE") || act.includes("DEACTIVATE") || act.includes("UNPUBLISH")) {
      return { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" };
    }
    if (act.includes("UPDATE") || act.includes("STATUS") || act.includes("REORDER")) {
      return { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" };
    }
    return { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
  };

  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return String(date);
    }
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#2B2B2B", margin: 0 }}>
              Activity History
            </h1>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "12px",
                background: "#EDE3D4",
                color: "#5C3A22",
              }}
            >
              Append-Only Audit Trail
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#6E6862", margin: 0 }}>
            Every database mutation performed by administrators is recorded here with commit notes and before/after snapshots.
          </p>
        </div>

        {/* Read-Only Status Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#FFFFFF",
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid #EDE3D4",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <span style={{ fontSize: "14px" }}>🔒</span>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#2B2B2B" }}>Immutable Audit Log</div>
            <div style={{ fontSize: "10px", color: "#8E8880" }}>Records cannot be edited or deleted</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EDE3D4",
          padding: "16px 20px",
          marginBottom: "20px",
          boxShadow: "0 2px 6px rgba(92,58,34,0.03)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            alignItems: "flex-end",
          }}
        >
          {/* Search */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5C3A22", marginBottom: "4px" }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Commit note, entity, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                borderRadius: "8px",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Module Filter */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5C3A22", marginBottom: "4px" }}>
              Module
            </label>
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                borderRadius: "8px",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              {MODULE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5C3A22", marginBottom: "4px" }}>
              Action
            </label>
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                borderRadius: "8px",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Commit Type Filter */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5C3A22", marginBottom: "4px" }}>
              Commit Type
            </label>
            <select
              value={commitFilter}
              onChange={(e) => {
                setCommitFilter(e.target.value as "ALL" | "CUSTOM" | "DEFAULT");
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                borderRadius: "8px",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <option value="ALL">All Commits</option>
              <option value="CUSTOM">Custom Notes Only</option>
              <option value="DEFAULT">Default Notes Only</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5C3A22", marginBottom: "4px" }}>
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "6px 10px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                borderRadius: "8px",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* End Date */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5C3A22", marginBottom: "4px" }}>
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "6px 10px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                borderRadius: "8px",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Reset Button */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                padding: "8px 14px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#5C3A22",
                cursor: "pointer",
                whiteSpace: "nowrap",
                height: "33px",
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "10px",
            color: "#DC2626",
            fontSize: "13px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* Main Table Container */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EDE3D4",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(92,58,34,0.04)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#FAF7F2", borderBottom: "1px solid #EDE3D4" }}>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#5C3A22", fontSize: "11px", textTransform: "uppercase" }}>
                  Date & Time
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#5C3A22", fontSize: "11px", textTransform: "uppercase" }}>
                  Administrator
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#5C3A22", fontSize: "11px", textTransform: "uppercase" }}>
                  Module & Action
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#5C3A22", fontSize: "11px", textTransform: "uppercase" }}>
                  Entity
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#5C3A22", fontSize: "11px", textTransform: "uppercase" }}>
                  Commit Note
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#5C3A22", fontSize: "11px", textTransform: "uppercase", textAlign: "center" }}>
                  Commit Type
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#5C3A22", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#8E8880" }}>
                    <div style={{ display: "inline-block", animation: "spin 1s linear infinite", fontSize: "20px", marginBottom: "8px" }}>
                      ⏳
                    </div>
                    <div>Loading activity history...</div>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "48px 20px", textAlign: "center", color: "#8E8880" }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>📋</div>
                    <div style={{ fontWeight: 600, color: "#2B2B2B", fontSize: "14px", marginBottom: "4px" }}>
                      No activity logs found
                    </div>
                    <div style={{ fontSize: "12px" }}>
                      Database modifications will automatically appear here.
                    </div>
                  </td>
                </tr>
              ) : (
                activities.map((item) => {
                  const actionStyle = getActionBadgeStyle(item.action);
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #F0E6DA",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF7F2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Date */}
                      <td style={{ padding: "14px 16px", color: "#4A4A4A", whiteSpace: "nowrap", fontSize: "12px" }}>
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Administrator */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 600, color: "#2B2B2B", fontSize: "12px" }}>
                          {item.adminEmail}
                        </div>
                      </td>

                      {/* Module & Action */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "2px 6px",
                              borderRadius: "6px",
                              background: "#F7EDE2",
                              color: "#5C3A22",
                            }}
                          >
                            {item.module}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "2px 6px",
                              borderRadius: "6px",
                              background: actionStyle.bg,
                              color: actionStyle.text,
                              border: `1px solid ${actionStyle.border}`,
                            }}
                          >
                            {item.action}
                          </span>
                        </div>
                      </td>

                      {/* Entity */}
                      <td style={{ padding: "14px 16px", maxWidth: "200px" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#2B2B2B",
                            fontSize: "12px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={item.entityName || item.entityType}
                        >
                          {item.entityName || item.entityType}
                        </div>
                        <div style={{ fontSize: "10px", color: "#8E8880" }}>{item.entityType}</div>
                      </td>

                      {/* Commit Note */}
                      <td style={{ padding: "14px 16px", maxWidth: "260px" }}>
                        <div
                          style={{
                            color: item.isCustomCommit ? "#5C3A22" : "#4A4A4A",
                            fontWeight: item.isCustomCommit ? 600 : 400,
                            fontSize: "12px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={item.commitNote}
                        >
                          &ldquo;{item.commitNote}&rdquo;
                        </div>
                      </td>

                      {/* Commit Type */}
                      <td style={{ padding: "14px 16px", textAlign: "center", whiteSpace: "nowrap" }}>
                        {item.isCustomCommit ? (
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "3px 8px",
                              borderRadius: "10px",
                              background: "#FEF3C7",
                              color: "#92400E",
                              border: "1px solid #FDE68A",
                            }}
                          >
                            Custom Commit
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 500,
                              padding: "3px 8px",
                              borderRadius: "10px",
                              background: "#F3F4F6",
                              color: "#6B7280",
                              border: "1px solid #E5E7EB",
                            }}
                          >
                            Default Commit
                          </span>
                        )}
                      </td>

                      {/* Details button */}
                      <td style={{ padding: "14px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(item.id)}
                          style={{
                            padding: "6px 12px",
                            background: "#F7F2EC",
                            border: "1px solid #EDE3D4",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#5C3A22",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#5C3A22";
                            e.currentTarget.style.color = "#FFFFFF";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#F7F2EC";
                            e.currentTarget.style.color = "#5C3A22";
                          }}
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div
          style={{
            padding: "14px 20px",
            background: "#FAF7F2",
            borderTop: "1px solid #EDE3D4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "12px", color: "#6E6862" }}>
            Showing <strong>{activities.length}</strong> of <strong>{total}</strong> activity entries
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Page Size */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6E6862" }}>
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  padding: "4px 8px",
                  background: "#FFFFFF",
                  border: "1px solid #EDE3D4",
                  borderRadius: "6px",
                  fontSize: "12px",
                  outline: "none",
                }}
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Page Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: "5px 12px",
                  background: page <= 1 ? "#F3F4F6" : "#FFFFFF",
                  border: "1px solid #EDE3D4",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: page <= 1 ? "#9CA3AF" : "#2B2B2B",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                }}
              >
                ← Prev
              </button>

              <span style={{ fontSize: "12px", fontWeight: 600, color: "#2B2B2B", padding: "0 6px" }}>
                {page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: "5px 12px",
                  background: page >= totalPages ? "#F3F4F6" : "#FFFFFF",
                  border: "1px solid #EDE3D4",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: page >= totalPages ? "#9CA3AF" : "#2B2B2B",
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Details Drawer / Modal */}
      {selectedActivityId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(18, 16, 14, 0.65)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={handleCloseDetails}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "18px",
              border: "1px solid #EDE3D4",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              overflow: "hidden",
              animation: "adminModalPop 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #F0E6DA",
                background: "#FAF7F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "16px" }}>📋</span>
                  <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#2B2B2B", margin: 0 }}>
                    Activity Record Details
                  </h2>
                </div>
                <div style={{ fontSize: "12px", color: "#8E8880" }}>
                  Audit ID: {selectedActivityId}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDetails}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  color: "#8E8880",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              {isLoadingDetails || !detailActivity ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#8E8880" }}>
                  ⏳ Loading details and computing diffs...
                </div>
              ) : (
                <div>
                  {/* Metadata Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "14px",
                      marginBottom: "20px",
                      padding: "16px",
                      background: "#FAF7F2",
                      borderRadius: "12px",
                      border: "1px solid #EDE3D4",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase" }}>
                        Administrator
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2B2B2B", marginTop: "2px" }}>
                        {detailActivity.adminEmail}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase" }}>
                        Timestamp
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2B2B2B", marginTop: "2px" }}>
                        {formatDate(detailActivity.createdAt)}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase" }}>
                        Module & Action
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2B2B2B", marginTop: "2px" }}>
                        {detailActivity.module} • {detailActivity.action}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase" }}>
                        Entity
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2B2B2B", marginTop: "2px" }}>
                        {detailActivity.entityName || detailActivity.entityType} ({detailActivity.entityType})
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase" }}>
                        Commit Type
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2B2B2B", marginTop: "2px" }}>
                        {detailActivity.isCustomCommit ? "✍️ Custom Commit Note" : "⚙️ Default Generated Commit"}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase" }}>
                        Transaction Status
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#059669", marginTop: "2px" }}>
                        ✓ {detailActivity.transactionStatus}
                      </div>
                    </div>
                  </div>

                  {/* Commit Note Section */}
                  <div style={{ marginBottom: "22px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#5C3A22", marginBottom: "6px" }}>
                      Commit Note:
                    </div>
                    <div
                      style={{
                        padding: "12px 14px",
                        background: "#F7F2EC",
                        borderRadius: "8px",
                        border: "1px solid #EDE3D4",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#2B2B2B",
                        fontStyle: "italic",
                      }}
                    >
                      &ldquo;{detailActivity.commitNote}&rdquo;
                    </div>
                  </div>

                  {/* Changes Diff Viewer */}
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#5C3A22", marginBottom: "10px" }}>
                      Database Changes Snapshot:
                    </div>

                    {detailDiffs.length > 0 ? (
                      <div
                        style={{
                          border: "1px solid #EDE3D4",
                          borderRadius: "10px",
                          overflow: "hidden",
                          marginBottom: "16px",
                        }}
                      >
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                          <thead>
                            <tr style={{ background: "#FAF7F2", borderBottom: "1px solid #EDE3D4" }}>
                              <th style={{ padding: "10px 14px", fontWeight: 700, color: "#5C3A22", width: "30%" }}>
                                Modified Field
                              </th>
                              <th style={{ padding: "10px 14px", fontWeight: 700, color: "#DC2626", width: "35%" }}>
                                Before State
                              </th>
                              <th style={{ padding: "10px 14px", fontWeight: 700, color: "#059669", width: "35%" }}>
                                After State
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailDiffs.map((diff) => (
                              <tr key={diff.field} style={{ borderBottom: "1px solid #F0E6DA" }}>
                                <td style={{ padding: "10px 14px", fontWeight: 600, color: "#2B2B2B" }}>
                                  {diff.label}
                                </td>
                                <td
                                  style={{
                                    padding: "10px 14px",
                                    color: "#991B1B",
                                    background: "#FEF2F2",
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {diff.beforeValue !== null && diff.beforeValue !== undefined
                                    ? String(diff.beforeValue)
                                    : "(empty)"}
                                </td>
                                <td
                                  style={{
                                    padding: "10px 14px",
                                    color: "#065F46",
                                    background: "#ECFDF5",
                                    fontWeight: 600,
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {diff.afterValue !== null && diff.afterValue !== undefined
                                    ? String(diff.afterValue)
                                    : "(empty)"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : detailActivity.action === "CREATE" ? (
                      <div
                        style={{
                          padding: "14px",
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          borderRadius: "8px",
                          color: "#065F46",
                          fontSize: "12px",
                        }}
                      >
                        <strong>✓ Created Record:</strong> New entity inserted successfully into the database.
                      </div>
                    ) : detailActivity.action === "DELETE" ? (
                      <div
                        style={{
                          padding: "14px",
                          background: "#FEF2F2",
                          border: "1px solid #FECACA",
                          borderRadius: "8px",
                          color: "#991B1B",
                          fontSize: "12px",
                        }}
                      >
                        <strong>🗑️ Removed Record:</strong> Entity removed or deactivated safely.
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: "14px",
                          background: "#FAF7F2",
                          border: "1px solid #EDE3D4",
                          borderRadius: "8px",
                          color: "#6E6862",
                          fontSize: "12px",
                        }}
                      >
                        All attributes remained in sync with database snapshot.
                      </div>
                    )}
                  </div>

                  {/* Sanitization Notice */}
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "10px 14px",
                      background: "#FAF7F2",
                      border: "1px solid #EDE3D4",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "#8E8880",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>🛡️</span>
                    <span>
                      Sensitive fields (passwords, tokens, API keys) are sanitized automatically prior to log persistence.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: "1px solid #F0E6DA",
                background: "#FAF7F2",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={handleCloseDetails}
                style={{
                  padding: "8px 18px",
                  background: "#5C3A22",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
