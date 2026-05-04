"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-text-muted text-sm uppercase tracking-widest hover:text-accent-gold transition-colors cursor-pointer"
    >
      Logout
    </button>
  );
}
