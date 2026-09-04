"use client";

import Link from "next/link";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer" id="footer" style={{ background: "#24201D", color: "#FFFFFF", paddingTop: "50px" }}>
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Socials & App Download */}
          <div className="footer-brand-col">
            <Link href="/" className="footer-logo">
              <div className="fl-box">
                <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                  <rect width="36" height="36" rx="9" fill="#8B5E3C" />
                  <path d="M8 8h12a6 6 0 010 12H8V8zm0 12h7v8H8v-8z" fill="#2B2B2B" />
                </svg>
              </div>
              <div>
                <p className="fl-name" style={{ margin: 0, fontWeight: 800, fontSize: "1.2rem", color: "#FFFFFF" }}>Box Care</p>
                <p className="fl-tag" style={{ margin: 0, fontSize: "0.68rem", color: "#D68A45", textTransform: "uppercase", letterSpacing: "0.1em" }}>Premium Packaging</p>
              </div>
            </Link>
            <p className="footer-desc" style={{ marginTop: "14px", fontSize: "0.86rem", color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
              Box Care delivers premium custom cardboard packaging to 1,000+ businesses across India. GST-inclusive, eco-friendly, and fully customizable.
            </p>

            {/* Social Icons */}
            <div className="footer-socials" style={{ marginTop: "12px", marginBottom: "16px", display: "flex", gap: "10px" }}>
              <a href="#" className="fsoc" id="fsoc-instagram" aria-label="Instagram" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="fsoc" id="fsoc-facebook" aria-label="Facebook" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="fsoc" id="fsoc-linkedin" aria-label="LinkedIn" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="fsoc" id="fsoc-youtube" aria-label="YouTube" title="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
              </a>
            </div>

            {/* Mobile App Box */}
            <div className="footer-app-box">
              <span className="footer-app-title">Download Mobile App</span>
              <div className="footer-app-btns">
                <a href="#app-download" className="official-app-btn" aria-label="Download on the App Store">
                  <div className="official-btn-icon">
                    <svg width="24" height="28" viewBox="0 0 170 170" fill="#FFFFFF">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.48-6.1-3.26-2.62-7.14-7.24-11.64-13.88-6.09-8.92-10.9-18.73-14.42-29.43-3.52-10.7-5.28-21.03-5.28-31 0-14.48 3.73-26.47 11.19-35.97 7.46-9.5 16.92-14.34 28.38-14.52 4.71 0 9.87 1.14 15.48 3.42 5.61 2.28 9.5 3.42 11.68 3.42 1.95 0 5.97-1.19 12.06-3.58 6.09-2.39 11.14-3.47 15.15-3.24 10.37.52 19.04 4.3 26.01 11.35-9.35 5.64-13.9 13.78-13.66 24.42.24 8.35 3.39 15.35 9.46 21 6.07 5.65 13.33 8.78 21.78 9.38-2.6 7.64-6.19 15.29-10.77 22.95zM119.22 31.84c0-7.39 2.65-14.39 7.95-21 5.3-6.61 12-10.45 20.1-11.52.54 6.78-1.52 13.61-6.19 20.49-4.67 6.88-11.02 11.17-19.05 12.87-.55-.65-1.52-1.07-2.81-1.07v.23z"/>
                    </svg>
                  </div>
                  <div className="official-btn-text">
                    <span className="official-btn-sub">Download on the</span>
                    <span className="official-btn-title">App Store</span>
                  </div>
                </a>

                <a href="#app-download" className="official-app-btn" aria-label="Get it on Google Play">
                  <div className="official-btn-icon">
                    <svg width="24" height="26" viewBox="0 0 512 512">
                      <path fill="#415A77" d="M48 40.57v430.86c0 14.51 16.03 23.28 28.2 15.49l336.85-215.43c11.53-7.38 11.53-24.6 0-31.98L76.2 39.08C64.03 31.29 48 40.06 48 40.57z" opacity="0.1"/>
                      <path fill="#00D2FF" d="M68.5 24.6C54.1 16.4 36 26.8 36 43.4v425.2c0 16.6 18.1 27 32.5 18.8l197.8-113.8L165.6 273 68.5 24.6z"/>
                      <path fill="#00F076" d="M381.7 202.9l-115.4 66.6 99.3 99.3 115.4-66.6c16-9.2 16-32.3 0-41.5l-99.3-57.8z"/>
                      <path fill="#FF3A44" d="M266.3 269.5L68.5 487.4c14.4 8.2 32.5-2.2 32.5-18.8v-3.7l165.3-195.4z"/>
                      <path fill="#FFAE00" d="M266.3 242.5L101 22.8C86.6 14.6 68.5 25 68.5 41.6v3.7l197.8 197.2z"/>
                    </svg>
                  </div>
                  <div className="official-btn-text">
                    <span className="official-btn-sub">Get it on</span>
                    <span className="official-btn-title">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="footer-links-col">
            <h5>Products</h5>
            <ul>
              <li><Link href="/category/mailer-boxes" id="fl-mailer">Mailer Boxes</Link></li>
              <li><Link href="/category/corrugated-boxes" id="fl-corrugated">Corrugated Boxes</Link></li>
              <li><Link href="/category/shipping-boxes" id="fl-shipping">Shipping Boxes</Link></li>
              <li><Link href="/category/pizza-boxes" id="fl-pizza">Pizza Boxes</Link></li>
              <li><Link href="/category/mono-cartons" id="fl-mono">Mono Cartons</Link></li>
              <li><Link href="/category/courier-bags" id="fl-courier">Courier Bags</Link></li>
              <li><Link href="/category/paper-bags" id="fl-paperbags">Paper Bags</Link></li>
              <li><Link href="/category/tape-rolls" id="fl-taperolls">Tape Rolls</Link></li>
              <li><Link href="/category/bubble-wrap" id="fl-bubblewrap">Bubble Wrap</Link></li>
              <li><Link href="/category/corrugated-rolls" id="fl-corrugatedrolls">Corrugated Rolls</Link></li>
              <li><Link href="/category/corrugated-sheets" id="fl-corrugatedsheets">Corrugated Sheets</Link></li>
              <li><Link href="/category/custom-printed-boxes" id="fl-gift">Custom Printed Boxes</Link></li>
            </ul>
          </div>

          {/* Col 3: Industries */}
          <div className="footer-links-col">
            <h5>Industries</h5>
            <ul>
              <li><Link href="/industries" id="fl-food">Food &amp; Beverage</Link></li>
              <li><Link href="/industries" id="fl-beauty">Beauty &amp; Cosmetics</Link></li>
              <li><Link href="/industries" id="fl-pharma">Pharma</Link></li>
              <li><Link href="/industries" id="fl-ecomm">E-Commerce</Link></li>
              <li><Link href="/industries" id="fl-fashion">Fashion</Link></li>
              <li><Link href="/industries" id="fl-electronics-f">Electronics</Link></li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="footer-links-col">
            <h5>Support</h5>
            <ul>
              <li><Link href="/about" id="fl-faq">FAQs</Link></li>
              <li><Link href="/order/track" id="fl-track">Track Order</Link></li>
              <li><Link href="/contact" id="fl-sample">Request Sample</Link></li>
              <li><Link href="/policies/return-policy" id="fl-return">Return Policy</Link></li>
              <li><Link href="/policies/privacy-policy" id="fl-privacy">Privacy Policy</Link></li>
              <li><Link href="/policies/terms-of-service" id="fl-terms">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div className="footer-links-col">
            <h5>Contact</h5>
            <ul>
              <li>
                <a href="tel:+918000000000" id="fl-phone">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  +91 80000 00000
                </a>
              </li>
              <li>
                <a href="mailto:hello@boxcare.in" id="fl-email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  hello@boxcare.in
                </a>
              </li>
              <li>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Mumbai, Maharashtra, India
                </span>
              </li>
              <li>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Mon–Sat, 9 AM – 7 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 0", marginTop: "40px" }}>
        <div className="container">
          <div className="fb-inner" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>&copy; 2024 Box Care Pvt. Ltd. All rights reserved. Made with ❤️ in India.</p>
            <div className="payment-methods" style={{ display: "flex", gap: "8px" }}>
              <span className="pm-badge">VISA</span>
              <span className="pm-badge">MC</span>
              <span className="pm-badge">UPI</span>
              <span className="pm-badge">GPay</span>
              <span className="pm-badge">Razorpay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <a href="https://wa.me/918000000000" className="whatsapp-fab" id="whatsapp-fab" aria-label="Chat on WhatsApp" target="_blank" rel="noopener noreferrer">
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span className="wfab-tooltip">Chat with us</span>
      </a>

      <button className="back-top-btn" onClick={scrollToTop} aria-label="Back to top" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    </footer>
  );
}
