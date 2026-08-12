"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";

const links = [
  {
    href: "/admin",
    label: "Messages",
    icon: "M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.24-8 4.76-8-4.76V6l8 4.76L20 6v2.24Z",
  },
  {
    href: "/admin/posts",
    label: "Blog posts",
    icon: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-2 6H7V7h10v2Zm0 4H7v-2h10v2Zm-3 4H7v-2h7v2Z",
  },
  {
    href: "/admin/posts/new",
    label: "New post",
    icon: "M19 11h-6V5h-2v6H5v2h6v6h2v-6h6v-2Z",
  },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") return children;

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${open ? " open" : ""}`}>
        <Link href="/admin" className="admin-brand">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>
          <span>
            Life Secret Plus
            <small>Admin panel</small>
          </span>
        </Link>

        <nav className="admin-nav">
          {links.map((link) => {
            const active =
              link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={link.icon} />
                </svg>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <Link href="/" target="_blank" className="admin-visit">
            View website ↗
          </Link>
          <form action={logout}>
            <button className="btn btn-outline btn-sm" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {open && <div className="admin-scrim" onClick={() => setOpen(false)} />}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-burger"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
          <strong>Admin panel</strong>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
