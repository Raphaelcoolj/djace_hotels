"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";

type HeaderClientProps = {
  variant: "over-hero" | "solid" | "minimal";
  authenticated: boolean;
  isAdmin: boolean;
  userName?: string;
};

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/rooms" },
  { label: "Experiences", href: "/#experiences" },
  { label: "About", href: "/#about" },
];

export default function HeaderClient({
  variant,
  authenticated,
  isAdmin,
  userName,
}: HeaderClientProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isOverHero = variant === "over-hero";
  const solid = variant === "solid" || (isOverHero && scrolled) || menuOpen;
  const minimal = variant === "minimal";

  const textColor = solid ? "text-charcoal" : "text-ivory";
  const subColor = solid ? "text-warmgrey" : "text-ivory/60";

  return (
    <>
      <header
        className={`${
          minimal ? "absolute" : "fixed"
        } top-0 left-0 right-0 z-50 transition-colors duration-500 ease-luxe ${
          solid && !minimal
            ? "bg-ivory/95 backdrop-blur-md border-b border-line"
            : minimal
              ? "bg-transparent"
              : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container flex h-16 md:h-20 items-center justify-between gap-6">
          {/* Brand */}
          <Link
            href="/"
            className={`group flex flex-col leading-none ${textColor} transition-colors duration-300`}
            aria-label="Luxury Hotel & Lounge — home"
          >
            <span className="font-heading text-lg md:text-2xl font-medium uppercase tracking-[0.32em]">
              Luxury
            </span>
            <span
              className={`mt-1 font-body text-[8px] md:text-[9px] uppercase tracking-[0.42em] ${subColor} group-hover:text-gold transition-colors duration-300`}
            >
              Hotel &amp; Lounge
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-9" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : link.href.startsWith("/#")
                    ? false
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  data-active={active}
                  className={`link-underline ${textColor} hover:text-gold data-[active=true]:text-gold`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-7">
            {authenticated ? (
              <>
                <Link
                  href="/dashboard"
                  data-active={pathname === "/dashboard"}
                  className={`link-underline ${textColor} hover:text-gold data-[active=true]:text-gold`}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    data-active={pathname === "/admin"}
                    className={`link-underline text-gold`}
                  >
                    Admin
                  </Link>
                )}
                <LogoutButton tone={solid ? "dark" : "light"} />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  data-active={pathname === "/login"}
                  className={`link-underline ${textColor} hover:text-gold data-[active=true]:text-gold`}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className={`link-underline ${textColor} hover:text-gold`}
                >
                  Register
                </Link>
              </>
            )}
            <Link href="/rooms" className="btn btn-gold btn-sm">
              Reserve
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`lg:hidden relative z-10 flex h-11 w-11 flex-col items-center justify-center gap-1.5 ${
              menuOpen || solid ? "text-charcoal" : "text-ivory"
            }`}
          >
            <span
              className={`block h-px w-6 bg-current transition-transform duration-500 ease-luxe ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-current transition-transform duration-500 ease-luxe ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Spacer keeps page content clear of the fixed header */}
      {variant === "solid" && <div aria-hidden className="h-16 md:h-20" />}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden fixed inset-0 z-40 bg-ivory transition-[opacity,visibility] duration-500 ease-luxe ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex h-full flex-col justify-between px-6 pb-10 pt-24">
          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <li
                  key={link.label}
                  className={`transition-all duration-500 ease-luxe ${
                    menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : "0ms" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-line py-4 font-heading text-3xl font-light text-charcoal transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={`flex flex-col gap-4 transition-all duration-500 ease-luxe ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: menuOpen ? "340ms" : "0ms" }}
          >
            {authenticated ? (
              <>
                <p className="overline-muted">
                  {userName ? `Signed in as ${userName}` : "Signed in"}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/dashboard" className="btn btn-outline btn-sm">
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="btn btn-outline btn-sm">
                      Admin
                    </Link>
                  )}
                  <LogoutButton tone="dark" asButton />
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="btn btn-outline btn-sm">
                  Sign in
                </Link>
                <Link href="/register" className="btn btn-outline btn-sm">
                  Register
                </Link>
              </div>
            )}
            <Link href="/rooms" className="btn btn-gold btn-block">
              Reserve Your Stay
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
