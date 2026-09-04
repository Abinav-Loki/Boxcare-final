"use client";

import React from "react";
import { CartProvider } from "./cart-context";
import { AnnouncementBar } from "./announcement-bar";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { QuickViewModal } from "./quick-view-modal";

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <AnnouncementBar />
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <CartDrawer />
        <QuickViewModal />
      </div>
    </CartProvider>
  );
}
