"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={async () => {
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
      }}
      className="text-white font-body text-[10px] md:text-sm tracking-widest uppercase hover:text-accent-gold transition-colors cursor-pointer"
    >
      Logout
    </button>
  );
}
