"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Product, PRODUCTS, getUnitPrice } from "@/lib/products-data";
import { getAdminProductsAction } from "@/app/actions/admin-products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  wishlist: string[];
  wishlistProducts: Product[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  allProducts: Product[];
  refreshProducts: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProductsLoaded, setIsProductsLoaded] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const res = await getAdminProductsAction();
      if (res.success && res.data && res.data.length > 0) {
        const dbProds = res.data as Product[];
        const dbIds = new Set(dbProds.map((p) => p.id));
        const dbSlugs = new Set(dbProds.map((p) => p.slug));

        const staticFallbacks = PRODUCTS.filter((p) => !dbIds.has(p.id) && !dbSlugs.has(p.slug));
        setAllProducts([...dbProds, ...staticFallbacks]);
      } else {
        setAllProducts(PRODUCTS);
      }
    } catch (e) {
      console.error("Failed to load products in CartProvider", e);
      setAllProducts(PRODUCTS);
    } finally {
      setIsProductsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("boxcare_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem("boxcare_wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.error("Failed to load cart/wishlist from localStorage", e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("boxcare_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("boxcare_wishlist", JSON.stringify(wishlist));
      } catch (e) {
        console.error("Failed to save wishlist to localStorage", e);
      }
    }
  }, [wishlist, isInitialized]);

  // Clean stale/orphaned IDs from wishlist once products are verified
  useEffect(() => {
    if (isInitialized && isProductsLoaded && allProducts.length > 0 && wishlist.length > 0) {
      const validIds = wishlist.filter((item) =>
        allProducts.some((p) => p.id === item || p.slug === item)
      );
      if (validIds.length !== wishlist.length) {
        setWishlist(validIds);
      }
    }
  }, [isInitialized, isProductsLoaded, allProducts, wishlist]);

  const wishlistProducts = useMemo(() => {
    if (wishlist.length === 0) return [];
    const list: Product[] = [];
    const seen = new Set<string>();

    for (const item of wishlist) {
      const match = allProducts.find((p) => p.id === item || p.slug === item);
      if (match && !seen.has(match.id)) {
        seen.add(match.id);
        list.push(match);
      }
    }
    return list;
  }, [wishlist, allProducts]);

  const wishlistCount = wishlistProducts.length;

  const addToCart = (product: Product, quantity = 50, selectedSize?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      return [...prev, { product, quantity, selectedSize: selectedSize || product.size_inches_short }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => setWishlist([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((total, item) => {
    const unitPrice = getUnitPrice(item.product, item.quantity);
    return total + unitPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        wishlist,
        wishlistProducts,
        wishlistCount,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        allProducts,
        refreshProducts: loadProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
