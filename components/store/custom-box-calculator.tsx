"use client";

import React, { useState, useRef, useEffect } from "react";

type BoxType = "mailer" | "shipping" | "carton" | "gift";
type MaterialType = "kraft" | "3ply" | "5ply" | "rigid";

const typeLabels: Record<BoxType, string> = {
  mailer: "Mailer Box",
  shipping: "Shipping Box",
  carton: "Mono Carton",
  gift: "Custom Printed Box",
};

const matLabels: Record<MaterialType, string> = {
  kraft: "Natural Kraft Paper",
  "3ply": "3-Ply Corrugated",
  "5ply": "5-Ply Heavy-Duty",
  rigid: "Rigid Gift Board",
};

const materialCosts: Record<MaterialType, number> = {
  kraft: 0.005,
  "3ply": 0.015,
  "5ply": 0.025,
  rigid: 0.04,
};

const typeFactors: Record<BoxType, number> = {
  mailer: 1.2,
  shipping: 1.0,
  carton: 0.8,
  gift: 1.5,
};

const minCosts: Record<BoxType, number> = {
  mailer: 12,
  shipping: 16,
  carton: 6,
  gift: 40,
};

export function CustomBoxCalculator() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [boxType, setBoxType] = useState<BoxType>("mailer");
  const [material, setMaterial] = useState<MaterialType>("kraft");
  const [length, setLength] = useState<number>(20);
  const [width, setWidth] = useState<number>(14);
  const [height, setHeight] = useState<number>(8);
  const [quantity, setQuantity] = useState<number>(500);

  // Logo file upload state
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  // Form submission contact details
  const [contactName, setContactName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // 3D Canvas rotation state
  const [rotX, setRotX] = useState<number>(-20);
  const [rotY, setRotY] = useState<number>(35);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle ScrollSpy / IntersectionObserver for Stepper
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepNum = parseInt(entry.target.getAttribute("data-step") || "1");
            if (stepNum) {
              setActiveStep(stepNum);
            }
          }
        });
      },
      { threshold: 0.35 }
    );

    document.querySelectorAll(".builder-step").forEach((step) => observer.observe(step));

    return () => observer.disconnect();
  }, []);

  const scrollToStep = (stepNum: number) => {
    setActiveStep(stepNum);
    const target = document.getElementById("bstep-" + stepNum);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle Logo Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogoFileName(file.name);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setLogoPreviewUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Pricing Model Calculation
  const l = length > 0 ? length : 20;
  const w = width > 0 ? width : 14;
  const h = height > 0 ? height : 8;
  const q = quantity > 0 ? quantity : 500;

  const surfaceArea = 2 * (l * w + w * h + l * h);
  const rawCost = surfaceArea * materialCosts[material] * typeFactors[boxType];
  let baseUnitCost = Math.max(minCosts[boxType], rawCost);

  let discountPct = 0;
  if (q >= 1000) discountPct = 35;
  else if (q >= 500) discountPct = 25;
  else if (q >= 300) discountPct = 20;
  else if (q >= 100) discountPct = 10;

  const finalUnitPrice = baseUnitCost * (1 - discountPct / 100);
  const subtotal = finalUnitPrice * q;
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  const formatPrice = (val: number) =>
    "₹" + val.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  // 3D Canvas Box Scaling
  const maxPx = 160;
  const largest = Math.max(l, w, h);
  const scale = maxPx / largest;
  const boxW = Math.round(l * scale);
  const boxH = Math.round(h * scale);
  const boxD = Math.round(w * scale);

  // 3D Mouse / Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - startXRef.current;
      const dy = e.clientY - startYRef.current;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;

      setRotY((prevY) => prevY + dx * 0.5);
      setRotX((prevX) => Math.max(-55, Math.min(55, prevX - dy * 0.5)));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // WhatsApp Quote Submission
  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const msg =
      `Hi Box Care! I'd like a custom box quote:\n` +
      `• Name: ${contactName || "—"}\n` +
      `• Phone: ${contactPhone || "—"}\n` +
      `• Box Type: ${typeLabels[boxType]}\n` +
      `• Material: ${matLabels[material]}\n` +
      `• Dimensions: ${l} × ${w} × ${h} cm\n` +
      `• Quantity: ${q} units\n` +
      `• Logo: ${logoFileName || "Not uploaded"}\n` +
      `• Estimated Price: ${formatPrice(finalUnitPrice)}/box (Total: ${formatPrice(grandTotal)} inc. GST)`;

    window.open(`https://wa.me/918903927262?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section className="builder-section section animate-builder" id="builder" style={{ background: "#2B2B2B", minHeight: "80vh", padding: "60px 0" }}>
      <div className="builder-bg">
        <div className="builder-blob bb1"></div>
        <div className="builder-blob bb2"></div>
      </div>
      <div className="container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        
        {/* Section Header */}
        <div className="section-head reveal-up visible" style={{ textAlign: "center", marginBottom: "36px" }}>
          <span className="section-tag light" style={{ letterSpacing: "0.12em" }}>Interactive 3D Design Studio</span>
          <h2 className="section-title light" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "#FFF", fontWeight: 800, marginTop: "8px" }}>
            Design &amp; Configure Your Perfect Box
          </h2>
          <p className="section-sub light" style={{ maxWidth: "780px", margin: "12px auto 24px auto", fontSize: "1.02rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>
            Welcome to the Box Care Configurator. Tailor every detail of your packaging in real time — choose box style, board material, custom dimensions, upload brand artwork, and unlock automated volume pricing with instant GST WhatsApp quotes.
          </p>

          {/* Context Feature Pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginTop: "20px" }}>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 18px", borderRadius: "30px", fontSize: "0.82rem", color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--orange-lt, #FAD8B4)", fontWeight: 800 }}>✓</span> 360° Drag-to-Rotate 3D Canvas
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 18px", borderRadius: "30px", fontSize: "0.82rem", color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--orange-lt, #FAD8B4)", fontWeight: 800 }}>✓</span> Custom Length × Width × Height (cm)
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 18px", borderRadius: "30px", fontSize: "0.82rem", color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--orange-lt, #FAD8B4)", fontWeight: 800 }}>✓</span> Real-Time Logo Artwork Placement
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 18px", borderRadius: "30px", fontSize: "0.82rem", color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#81C784", fontWeight: 800 }}>✓</span> Automated Volume Discounts (Up to 35% OFF)
            </div>
          </div>
        </div>

        {/* Stepper Navigation Bar (Acts as Sticky Quick-Jump Bar) */}
        <div className="builder-stepper" id="builder-stepper" style={{ position: "sticky", top: "calc(var(--header-h, 68px) + 8px)", zIndex: 20 }}>

          {[
            { num: 1, title: "Box Type" },
            { num: 2, title: "Material" },
            { num: 3, title: "Size" },
            { num: 4, title: "Artwork" },
            { num: 5, title: "Preview" },
            { num: 6, title: "Quote" },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              {idx > 0 && <div className="stepper-sep"></div>}
              <div
                className={`stepper-item ${activeStep === s.num ? "active" : activeStep > s.num ? "completed" : ""}`}
                onClick={() => scrollToStep(s.num)}
              >
                <div className="stepper-num">{activeStep > s.num ? "✓" : s.num}</div>
                <span>{s.title}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* 2-Column Layout */}
        <div className="builder-layout-grid">
          {/* Left Column: All 6 Sections Continuously Rendered & Scrollable */}
          <div className="builder-steps" id="builder-steps" style={{ width: "100%" }}>
            
            {/* STEP 1: CHOOSE BOX TYPE */}
            <div className="builder-step active" id="bstep-1" data-step="1">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="bs-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--orange-lt, #FAD8B4)", letterSpacing: "0.1em", background: "rgba(214,138,69,0.15)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(214,138,69,0.3)" }}>SECTION 01 OF 06</span>
              </div>
              <h4>1. Choose Box Structure</h4>
              <p>Select your box structure style. Photorealistic preview updates on the right.</p>

              <div className="builder-box-cards-grid">
                {/* Mailer Box Card */}
                <label className={`box-type-card ${boxType === "mailer" ? "selected" : ""}`}>
                  <input type="radio" name="box-type" value="mailer" checked={boxType === "mailer"} onChange={() => setBoxType("mailer")} />
                  <div className="btc-badge">POPULAR</div>
                  <div className="btc-img-wrapper">
                    <img src="/images/mailer-boxes.png" alt="Mailer Box" />
                  </div>
                  <div className="btc-info">
                    <h5>Mailer Box</h5>
                    <p>Self-locking fold mailer. Perfect for E-Commerce, cosmetics &amp; retail.</p>
                  </div>
                  <div className="btc-check">✓</div>
                </label>

                {/* Shipping Box Card */}
                <label className={`box-type-card ${boxType === "shipping" ? "selected" : ""}`}>
                  <input type="radio" name="box-type" value="shipping" checked={boxType === "shipping"} onChange={() => setBoxType("shipping")} />
                  <div className="btc-img-wrapper">
                    <img src="/images/corrugated-boxes.png" alt="Shipping Box" />
                  </div>
                  <div className="btc-info">
                    <h5>Shipping Box</h5>
                    <p>Heavy-Duty RSC cartons. Maximum protection for freight &amp; bulk orders.</p>
                  </div>
                  <div className="btc-check">✓</div>
                </label>

                {/* Mono Carton Card */}
                <label className={`box-type-card ${boxType === "carton" ? "selected" : ""}`}>
                  <input type="radio" name="box-type" value="carton" checked={boxType === "carton"} onChange={() => setBoxType("carton")} />
                  <div className="btc-img-wrapper">
                    <img src="/images/mono-cartons.png" alt="Mono Carton" />
                  </div>
                  <div className="btc-info">
                    <h5>Mono Carton</h5>
                    <p>Lightweight printed paperboard. Ideal for pharmaceuticals &amp; food.</p>
                  </div>
                  <div className="btc-check">✓</div>
                </label>

                {/* Custom Printed Box Card */}
                <label className={`box-type-card ${boxType === "gift" ? "selected" : ""}`}>
                  <input type="radio" name="box-type" value="gift" checked={boxType === "gift"} onChange={() => setBoxType("gift")} />
                  <div className="btc-badge gold">PREMIUM</div>
                  <div className="btc-img-wrapper">
                    <img src="/images/custom-printed-boxes.png" alt="Custom Printed Box" />
                  </div>
                  <div className="btc-info">
                    <h5>Custom Printed Box</h5>
                    <p>Vibrant CMYK branded finish. Unforgettable unboxing experience.</p>
                  </div>
                  <div className="btc-check">✓</div>
                </label>
              </div>
            </div>

            {/* STEP 2: SELECT MATERIAL */}
            <div className="builder-step active" id="bstep-2" data-step="2">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="bs-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--orange-lt, #FAD8B4)", letterSpacing: "0.1em", background: "rgba(214,138,69,0.15)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(214,138,69,0.3)" }}>SECTION 02 OF 06</span>
              </div>
              <h4>2. Select Material &amp; Thickness</h4>
              <p>Choose board strength based on your product weight &amp; shipping stress.</p>

              <div className="builder-mat-cards-grid">
                <label className={`mat-card ${material === "kraft" ? "selected" : ""}`}>
                  <input type="radio" name="material" value="kraft" checked={material === "kraft"} onChange={() => setMaterial("kraft")} />
                  <div className="mc-icon">♻️</div>
                  <div className="mc-info">
                    <h5>Natural Kraft Paper</h5>
                    <span className="mc-sub">100% Eco-friendly · Single Ply</span>
                    <span className="mc-rating">Lightweight (Up to 5kg)</span>
                  </div>
                  <div className="mc-check">✓</div>
                </label>

                <label className={`mat-card ${material === "3ply" ? "selected" : ""}`}>
                  <input type="radio" name="material" value="3ply" checked={material === "3ply"} onChange={() => setMaterial("3ply")} />
                  <div className="mc-icon">📦</div>
                  <div className="mc-info">
                    <h5>3-Ply Corrugated</h5>
                    <span className="mc-sub">Standard Flute · High Strength</span>
                    <span className="mc-rating">Medium Duty (Up to 15kg)</span>
                  </div>
                  <div className="mc-check">✓</div>
                </label>

                <label className={`mat-card ${material === "5ply" ? "selected" : ""}`}>
                  <input type="radio" name="material" value="5ply" checked={material === "5ply"} onChange={() => setMaterial("5ply")} />
                  <div className="mc-icon">🛡️</div>
                  <div className="mc-info">
                    <h5>5-Ply Heavy-Duty</h5>
                    <span className="mc-sub">Double Flute · Maximum Rigidity</span>
                    <span className="mc-rating">Heavy Duty (Up to 30kg)</span>
                  </div>
                  <div className="mc-check">✓</div>
                </label>

                <label className={`mat-card ${material === "rigid" ? "selected" : ""}`}>
                  <input type="radio" name="material" value="rigid" checked={material === "rigid"} onChange={() => setMaterial("rigid")} />
                  <div className="mc-icon">✨</div>
                  <div className="mc-info">
                    <h5>Rigid Gift Board</h5>
                    <span className="mc-sub">Premium Hard Board · Deluxe Feel</span>
                    <span className="mc-rating">Luxury Packaging</span>
                  </div>
                  <div className="mc-check">✓</div>
                </label>
              </div>
            </div>

            {/* STEP 3: CHOOSE SIZE */}
            <div className="builder-step active" id="bstep-3" data-step="3">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="bs-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 3H3v18h18V3z" />
                    <path d="M21 9H3" />
                    <path d="M9 21V3" />
                  </svg>
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--orange-lt, #FAD8B4)", letterSpacing: "0.1em", background: "rgba(214,138,69,0.15)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(214,138,69,0.3)" }}>SECTION 03 OF 06</span>
              </div>
              <h4>3. Custom Dimensions</h4>
              <p>Enter your exact box size in cm or select a popular product preset.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "4px", fontWeight: 600 }}>Length (L cm):</label>
                  <input
                    type="number"
                    className="bs-input"
                    value={length}
                    min="1"
                    onChange={(e) => setLength(parseFloat(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "4px", fontWeight: 600 }}>Width (W cm):</label>
                  <input
                    type="number"
                    className="bs-input"
                    value={width}
                    min="1"
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "4px", fontWeight: 600 }}>Height (H cm):</label>
                  <input
                    type="number"
                    className="bs-input"
                    value={height}
                    min="1"
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div style={{ margin: "20px 0 10px 0", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "0.78rem", width: "100%", color: "rgba(255,255,255,0.7)", fontWeight: 700, marginBottom: "2px" }}>Popular Industry Presets:</span>
                <button
                  type="button"
                  className="btn-preset-pill"
                  onClick={() => { setLength(17); setWidth(9); setHeight(4); }}
                  style={{ fontSize: "0.75rem", padding: "8px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#FFF", cursor: "pointer" }}
                >
                  📱 Smartphone (17x9x4 cm)
                </button>
                <button
                  type="button"
                  className="btn-preset-pill"
                  onClick={() => { setLength(39); setWidth(28); setHeight(6); }}
                  style={{ fontSize: "0.75rem", padding: "8px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#FFF", cursor: "pointer" }}
                >
                  💻 15&quot; Laptop (39x28x6 cm)
                </button>
                <button
                  type="button"
                  className="btn-preset-pill"
                  onClick={() => { setLength(35); setWidth(25); setHeight(30); }}
                  style={{ fontSize: "0.75rem", padding: "8px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#FFF", cursor: "pointer" }}
                >
                  🔌 Mixer Grinder (35x25x30 cm)
                </button>
              </div>
            </div>

            {/* STEP 4: UPLOAD LOGO */}
            <div className="builder-step active" id="bstep-4" data-step="4">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="bs-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--orange-lt, #FAD8B4)", letterSpacing: "0.1em", background: "rgba(214,138,69,0.15)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(214,138,69,0.3)" }}>SECTION 04 OF 06</span>
              </div>
              <h4>4. Upload Brand Logo / Artwork</h4>
              <p>Upload artwork for 3D placement on box faces (PNG, PDF, AI, SVG supported).</p>

              <label
                className="bs-upload-area"
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: "40px 20px", borderRadius: "16px" }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--orange, #D68A45)" strokeWidth="2" style={{ marginBottom: "12px" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span style={{ fontSize: "1.05rem" }}>
                  {logoFileName ? (
                    <strong style={{ color: "#4CAF50" }}>✓ {logoFileName} Uploaded</strong>
                  ) : (
                    <>Drop artwork file here or <strong>click to browse</strong></>
                  )}
                </span>
                <small style={{ color: "rgba(255,255,255,0.6)", marginTop: "6px" }}>PNG · PDF · AI · EPS · SVG accepted (max 20MB)</small>
              </label>
              <input
                type="file"
                ref={fileInputRef}
                className="bs-file-input"
                accept=".png,.pdf,.ai,.eps,.svg"
                onChange={handleFileChange}
              />
            </div>

            {/* STEP 5: QUANTITY & PRICING */}
            <div className="builder-step active" id="bstep-5" data-step="5">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="bs-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--orange-lt, #FAD8B4)", letterSpacing: "0.1em", background: "rgba(214,138,69,0.15)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(214,138,69,0.3)" }}>SECTION 05 OF 06</span>
              </div>
              <h4>5. Select Quantity &amp; Volume Pricing</h4>
              <p>Select order quantity to unlock volume discounts up to 35% OFF.</p>

              <div style={{ margin: "20px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
                <label style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "#FFFFFF", fontSize: "0.9rem" }}>
                  Select Order Quantity (Units):
                </label>
                <input
                  type="number"
                  className="bs-input"
                  value={quantity}
                  min="50"
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 50)}
                  style={{ fontSize: "1.1rem", padding: "14px", width: "100%", borderRadius: "12px" }}
                />
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { qty: 100, label: "100 units (10% OFF)" },
                    { qty: 500, label: "500 units (25% OFF)" },
                    { qty: 1000, label: "1,000 units (35% OFF 🔥)" },
                  ].map((item) => (
                    <button
                      key={item.qty}
                      type="button"
                      className="btn-preset-pill"
                      onClick={() => setQuantity(item.qty)}
                      style={{
                        padding: "8px 14px",
                        fontSize: "0.78rem",
                        borderRadius: "8px",
                        border: quantity === item.qty ? "2px solid var(--orange, #D68A45)" : "1px solid rgba(255,255,255,0.2)",
                        background: quantity === item.qty ? "rgba(214,138,69,0.2)" : "rgba(255,255,255,0.06)",
                        color: "#FFF",
                        cursor: "pointer",
                        fontWeight: quantity === item.qty ? 700 : 400,
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 6: REQUEST QUOTE FORM */}
            <div className="builder-step active" id="bstep-6" data-step="6">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="bs-icon success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#81C784", letterSpacing: "0.1em", background: "rgba(76,175,80,0.15)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(76,175,80,0.3)" }}>SECTION 06 OF 06</span>
              </div>
              <h4>6. Request Official Quote</h4>
              <p>Fill in contact details to receive formal GST quotation within 2 hours.</p>

              {isSubmitted ? (
                <div style={{ background: "rgba(76,175,80,0.2)", border: "1px solid rgba(76,175,80,0.4)", color: "#81C784", padding: "20px", borderRadius: "12px", textAlign: "center", fontWeight: 700 }}>
                  🎉 Quote Request Opened on WhatsApp! Our packaging team will confirm details shortly.
                </div>
              ) : (
                <form onSubmit={handleWhatsAppSubmit}>
                  <div className="bs-form">
                    <input
                      type="text"
                      className="bs-input"
                      placeholder="Your Full Name *"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                    <input
                      type="tel"
                      className="bs-input"
                      placeholder="Phone / WhatsApp Number *"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                    <input
                      type="email"
                      className="bs-input"
                      placeholder="Email Address *"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      style={{ gridColumn: "span 2" }}
                    />
                  </div>

                  <div className="bs-nav" style={{ marginTop: "24px" }}>
                    <button type="submit" className="bs-submit-btn" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
                      Send Quote Request via WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

          {/* Right Column: Persistent Sticky 3D Preview Canvas & Specifications */}
          <div className="builder-sticky-preview">

            <div className="bsp-header">
              <div className="bsp-header-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange, #D68A45)" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                Live 3D Box Visualizer
              </div>
              <span className="bsp-badge-live">Interactive</span>
            </div>

            {/* 3D Interactive Canvas */}
            <div
              className="calc-mockup-scene"
              onMouseDown={handleMouseDown}
              style={{
                height: "320px",
                background: "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.45) 100%)",
                borderRadius: "16px",
                cursor: "grab",
              }}
            >
              <div className="calc-scene-overlay">
                <span>🔄 Drag to rotate 360°</span>
              </div>
              <div
                className={`calc-3d-box material-${material} ${logoPreviewUrl ? "box-printed" : ""}`}
                style={{
                  width: `${boxW}px`,
                  height: `${boxH}px`,
                  transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                  ...({
                    "--box-w": `${boxW}px`,
                    "--box-h": `${boxH}px`,
                    "--box-d": `${boxD}px`,
                  } as React.CSSProperties),
                }}
              >
                <div className="calc-box-face front">
                  {logoPreviewUrl && (
                    <img src={logoPreviewUrl} className="calc-box-logo" alt="Logo" style={{ display: "block" }} />
                  )}
                </div>
                <div className="calc-box-face back"></div>
                <div className="calc-box-face left"></div>
                <div className="calc-box-face right"></div>
                <div className="calc-box-face top"></div>
                <div className="calc-box-face bottom"></div>
              </div>
            </div>

            {/* Live Price Estimate Highlight Box */}
            <div className="bsp-pricing-highlight">
              <div>
                <div className="bsp-price-label">Estimated Price</div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>Per Box (excl. GST)</div>
              </div>
              <div className="bsp-price-val">{formatPrice(finalUnitPrice)}</div>
            </div>

            {/* Live Specifications Table */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Type:</span>
                <strong style={{ color: "#FFF" }}>{typeLabels[boxType]}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Material:</span>
                <strong style={{ color: "#FFF" }}>{matLabels[material]}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Dimensions:</span>
                <strong style={{ color: "#FFF" }}>{l} × {w} × {h} cm</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Volume Discount:</span>
                <strong style={{ color: discountPct > 0 ? "#4CAF50" : "#FFF" }}>{discountPct > 0 ? `${discountPct}% OFF` : "Standard"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "6px", marginTop: "4px" }}>
                <span>Total Quote Estimate:</span>
                <strong style={{ color: "var(--orange-lt, #FAD8B4)", fontSize: "0.95rem" }}>{formatPrice(grandTotal)}</strong>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
