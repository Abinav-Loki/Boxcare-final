"use client";

import React, { Suspense } from "react";
import { CartProvider } from "./cart-context";
import { AnnouncementBar } from "./announcement-bar";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { WishlistDrawer } from "./wishlist-drawer";
import { QuickViewModal } from "./quick-view-modal";
import { CmsEditorBridge } from "./cms-editor-bridge";

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Suspense fallback={null}>
        <CmsEditorBridge />
      </Suspense>
      <div className="flex min-h-screen flex-col bg-white">
        <AnnouncementBar />
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <CartDrawer />
        <WishlistDrawer />
        <QuickViewModal />
      </div>
    </CartProvider>
  );
}
