"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, nav, socials } from "./site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-contact">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.12.37 2.33.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.27.2 2.48.57 3.6a1 1 0 0 1-.25 1l-2.22 2.2Z" />
              </svg>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.24-8 4.76-8-4.76V6l8 4.76L20 6v2.24Z" />
              </svg>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </span>
          </div>
          <div className="socials">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <header className="site-header">
        <nav className="nav" aria-label="Main">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              ✦
            </span>
            <span>
              Life Secret Plus
              <small>Insight &amp; Guidance</small>
            </span>
          </Link>

          <ul className={`nav-links${open ? " open" : ""}`} id="primary-menu">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      ? "page"
                      : undefined
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mobile-cta">
              <Link href="/contact" className="btn" style={{ width: "100%" }}>
                Get a Quote
              </Link>
            </li>
          </ul>

          <div className="nav-right">
            <Link href="/contact" className="btn btn-sm">
              Get a Quote
            </Link>
            <button
              type="button"
              className={`nav-toggle${open ? " open" : ""}`}
              aria-expanded={open}
              aria-controls="primary-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
