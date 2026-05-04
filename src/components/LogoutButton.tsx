"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={async () => {
        await signOut({ redirect: false });
        window.location.href = "/";
      }}
      className="text-white font-body text-[10px] md:text-sm tracking-widest uppercase hover:text-accent-gold transition-colors cursor-pointer"
    >
      Logout
    </button>
  );
}
