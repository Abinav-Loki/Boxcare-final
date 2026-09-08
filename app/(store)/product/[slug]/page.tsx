"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { useCart } from "@/components/store/cart-context";
import { getProductBySlug, getUnitPrice, PRODUCTS, Product } from "@/lib/products-data";
import { getAdminProductsAction } from "@/app/actions/admin-products";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";
  const [product, setProduct] = useState<Product>(() => getProductBySlug(slug) || PRODUCTS[0]);
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWished = isInWishlist(product.id);

  const [selectedQty, setSelectedQty] = useState<number>(50);
  const [customQtyInput, setCustomQtyInput] = useState<string>("");

  useEffect(() => {
    async function fetchDbProduct() {
      try {
        const res = await getAdminProductsAction();
        if (res.success && res.data && res.data.length > 0) {
          setAllProducts(res.data as any);
          const matched = res.data.find((p: any) => p.slug === slug || p.id === slug);
          if (matched) {
            setProduct(matched as any);
          }
        }
      } catch (err) {
        console.error("Failed to load DB product:", err);
      }
    }
    fetchDbProduct();
  }, [slug]);

  const effectiveQty = customQtyInput ? parseInt(customQtyInput) || 50 : selectedQty;
  const unitPrice = getUnitPrice(product, effectiveQty);
  const totalPrice = unitPrice * effectiveQty;

  const relatedProducts = allProducts.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, effectiveQty);
  };

  const handleBuyNow = () => {
    addToCart(product, effectiveQty);
    router.push("/checkout");
  };

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>
      {/* Breadcrumbs Navigation Row */}
      <div className="breadcrumbs-container">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span className="separator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <Link href="/products">Products</Link>
            <span className="separator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <Link href={`/category/${product.categorySlug}`}>{product.category}</Link>
            <span className="separator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <span className="current">{product.name}</span>
          </div>

          <div className="back-to-categories-wrap" style={{ margin: "0" }}>
            <button
              onClick={() => router.back()}
              className="back-category-btn"
              style={{ padding: "5px 12px", fontSize: "0.78rem", borderRadius: "8px" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      <section className="detail-section" style={{ padding: "30px 0 80px 0" }}>
        <div className="container">
          {/* Main Product Section */}
          <div style={{ background: "#FFFFFF", borderRadius: "24px", border: "1px solid #EDE3D4", padding: "36px", boxShadow: "0 10px 40px rgba(43,43,43,0.06)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", marginBottom: "60px" }}>
          {/* Left: Product Image Gallery */}
          <div>
            <div style={{ background: "#F7F2EC", borderRadius: "18px", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "360px", position: "relative" }}>
              <span style={{ position: "absolute", top: "16px", left: "16px", background: "#D68A45", color: "#FFF", fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", borderRadius: "12px", textTransform: "uppercase" }}>
                {product.category}
              </span>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWished ? "Remove from favorites" : "Add to favorites"}
                title={isWished ? "Remove from favorites" : "Add to favorites"}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: isWished ? "#FEF2F2" : "#FFFFFF",
                  border: isWished ? "1.5px solid #FCA5A5" : "1.5px solid #EAE0D5",
                  borderRadius: "50%",
                  width: "42px",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform: isWished ? "scale(1.05)" : "scale(1)",
                  zIndex: 5,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = isWished ? "scale(1.05)" : "scale(1)";
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isWished ? "#EF4444" : "none"}
                  stroke={isWished ? "#EF4444" : "#7A6E65"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "320px", objectFit: "contain" }} />
            </div>
          </div>

          {/* Right: Pricing, Specs & Buying Matrix */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b", fontWeight: 700, fontSize: "0.9rem", marginBottom: "8px" }}>
              <span>★</span>
              <span>{product.rating || 4.9} rating</span>
              <span style={{ color: "#888", fontWeight: 400 }}>• ({product.reviewsCount || 112} customer reviews)</span>
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#2B2B2B", lineHeight: 1.2, marginBottom: "12px" }}>
              {product.name}
            </h1>

            <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.6, marginBottom: "24px" }}>
              {product.description}
            </p>

            {/* Specifications Cards */}
            <div style={{ background: "#FAF7F2", borderRadius: "14px", padding: "16px", border: "1px solid #EDE3D4", marginBottom: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem" }}>
                <div>
                  <span style={{ color: "#888", display: "block" }}>Dimensions (Inches):</span>
                  <strong style={{ color: "#2B2B2B" }}>{product.size_inches}</strong>
                </div>
                <div>
                  <span style={{ color: "#888", display: "block" }}>Dimensions (Metric):</span>
                  <strong style={{ color: "#2B2B2B" }}>{product.size_cm}</strong>
                </div>
                <div>
                  <span style={{ color: "#888", display: "block" }}>Material Type:</span>
                  <strong style={{ color: "#2B2B2B" }}>{product.specifications?.Material || "Corrugated Cardboard"}</strong>
                </div>
                <div>
                  <span style={{ color: "#888", display: "block" }}>Dispatch Time:</span>
                  <strong style={{ color: "#15803d" }}>24-48 Hours Ready</strong>
                </div>
              </div>
            </div>

            {/* Pack Size Matrix */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontWeight: 800, fontSize: "0.9rem", color: "#5C3A22", display: "block", marginBottom: "10px" }}>
                Select Quantity Tier (MOQ: 50 pcs):
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "10px" }}>
                {[50, 100, 300, 500].map((qty) => {
                  const pPrice = getUnitPrice(product, qty);
                  const isSelected = effectiveQty === qty && !customQtyInput;
                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => { setSelectedQty(qty); setCustomQtyInput(""); }}
                      style={{
                        padding: "12px 10px",
                        borderRadius: "12px",
                        border: isSelected ? "2px solid #8B5E3C" : "1px solid #D8C9B4",
                        background: isSelected ? "#F7F2EC" : "#FFFFFF",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: "1rem", color: isSelected ? "#8B5E3C" : "#2B2B2B" }}>{qty} pcs</div>
                      <div style={{ fontSize: "0.78rem", color: "#8B5E3C", fontWeight: 700, marginTop: "2px" }}>
                        ₹{pPrice.toFixed(2)} / pc
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Quantity Input */}
              <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#666" }}>Custom Quantity:</span>
                <input
                  type="number"
                  min="50"
                  placeholder="e.g. 750"
                  value={customQtyInput}
                  onChange={(e) => setCustomQtyInput(e.target.value)}
                  style={{ width: "120px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #D8C9B4", fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Total Price Display */}
            <div style={{ background: "#F7F2EC", borderRadius: "16px", padding: "20px", marginBottom: "28px", border: "1px solid #EDE3D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "#888", display: "block" }}>Total Order Price</span>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#8B5E3C", lineHeight: 1.1 }}>
                  ₹{totalPrice.toFixed(2)}
                </div>
                <span style={{ fontSize: "0.78rem", color: "#15803d", fontWeight: 600 }}>
                  ₹{unitPrice.toFixed(2)} / box • GST Included
                </span>
              </div>
              <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#666" }}>
                <div>🚚 <strong>Free Shipping</strong> available</div>
                <div>♻️ 100% Recyclable Board</div>
              </div>
            </div>

            {/* Buying Buttons */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button className="btn-primary" style={{ flex: 1, padding: "16px", justifyContent: "center", fontSize: "1rem" }} onClick={handleAddToCart}>
                🛍️ Add to Cart
              </button>
              <button className="btn-secondary" style={{ flex: 1, padding: "16px", justifyContent: "center", fontSize: "1rem" }} onClick={handleBuyNow}>
                ⚡ Buy Now
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWished ? "Remove from favorites" : "Add to favorites"}
                title={isWished ? "Remove from favorites" : "Add to favorites"}
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  background: isWished ? "#FEF2F2" : "#FAF7F2",
                  border: isWished ? "1.5px solid #FCA5A5" : "1.5px solid #EAE0D5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill={isWished ? "#EF4444" : "none"}
                  stroke={isWished ? "#EF4444" : "#7A6E65"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Features & Specifications Tabs Section */}
        <div style={{ background: "#FFFFFF", borderRadius: "24px", border: "1px solid #EDE3D4", padding: "36px", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2B2B2B", marginBottom: "20px" }}>Key Features & Specifications</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#8B5E3C", marginBottom: "12px" }}>Product Highlights</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {product.features?.map((feat, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#4A4A4A" }}>
                    <span style={{ color: "#15803d", fontWeight: 900 }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#8B5E3C", marginBottom: "12px" }}>Technical Specifications</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <tbody>
                  {Object.entries(product.specifications || {}).map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: "1px solid #EDE3D4" }}>
                      <td style={{ padding: "8px 0", fontWeight: 600, color: "#666" }}>{key}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700, color: "#2B2B2B" }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2B2B2B", marginBottom: "24px" }}>Related Packaging Options</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "24px" }}>
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  </div>
  );
}
