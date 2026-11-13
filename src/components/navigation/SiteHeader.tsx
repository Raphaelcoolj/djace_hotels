import { auth } from "../../../auth";
import HeaderClient from "./HeaderClient";

type SiteHeaderProps = {
  /** "over-hero" = transparent above the hero, solidifies on scroll */
  variant?: "over-hero" | "solid" | "minimal";
};

export default async function SiteHeader({ variant = "solid" }: SiteHeaderProps) {
  const session = await auth();

  return (
    <HeaderClient
      variant={variant}
      authenticated={Boolean(session?.user?.email)}
      isAdmin={session?.user?.role === "admin"}
      userName={session?.user?.name ?? undefined}
    />
  );
}
