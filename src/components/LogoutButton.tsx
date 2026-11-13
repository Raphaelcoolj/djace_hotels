"use client";

import { signOut } from "next-auth/react";

type LogoutButtonProps = {
  /** "light" = for dark backgrounds, "dark" = for light backgrounds */
  tone?: "light" | "dark";
  /** Render as a full button (used in the mobile menu) */
  asButton?: boolean;
  className?: string;
};

export default function LogoutButton({
  tone = "light",
  asButton = false,
  className = "",
}: LogoutButtonProps) {
  const handleLogout = async () => {
    // Clear all session storage and cookies
    await signOut({ redirect: false });

    // Manual cleanup for stuck sessions
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Force a complete reload from the server
    window.location.href = window.location.origin + "/?logout=" + Date.now();
  };

  if (asButton) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className={`btn btn-outline btn-sm ${className}`}
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`cursor-pointer link-underline transition-colors duration-300 ${
        tone === "light" ? "text-ivory hover:text-gold" : "text-charcoal hover:text-gold"
      } ${className}`}
    >
      Sign out
    </button>
  );
}
