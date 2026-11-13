"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

type RoomFilterBarProps = {
  categories: string[];
};

/**
 * URL-driven filters for the rooms collection. Pills are plain links
 * (work without JS); selects auto-apply via router.replace.
 */
export default function RoomFilterBar({ categories }: RoomFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const activeClass = searchParams.get("class") ?? "";
  const guests = searchParams.get("guests") ?? "";
  const sort = searchParams.get("sort") ?? "price-asc";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";

  function buildParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function navigate(next: Record<string, string>) {
    router.replace(buildParams(next), { scroll: false });
  }

  // Auto-apply select changes
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onChange = () => {
      const data = new FormData(form);
      navigate({
        guests: String(data.get("guests") ?? ""),
        sort: String(data.get("sort") ?? "price-asc"),
      });
    };
    form.addEventListener("change", onChange);
    return () => form.removeEventListener("change", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname]);

  const hasDates = Boolean(checkIn && checkOut);

  return (
    <div className="border-y border-line bg-ivory">
      <div className="container flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Category pills */}
        <nav aria-label="Room categories" className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ class: "" })}
            className={`px-4 py-2 font-body text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
              activeClass === ""
                ? "bg-charcoal text-ivory"
                : "border border-line text-warmgrey hover:border-charcoal hover:text-charcoal"
            }`}
          >
            All rooms
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => navigate({ class: cat })}
              className={`px-4 py-2 font-body text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                activeClass === cat
                  ? "bg-charcoal text-ivory"
                  : "border border-line text-warmgrey hover:border-charcoal hover:text-charcoal"
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Selects */}
        <form
          ref={formRef}
          method="get"
          action={pathname}
          className="flex flex-wrap items-center gap-4"
        >
          {hasDates && (
            <span className="flex items-center gap-2 border border-gold/40 bg-gold/10 px-3 py-2 font-body text-[11px] tracking-wide text-gold-deep">
              {checkIn} → {checkOut}
              <button
                type="button"
                onClick={() => navigate({ checkIn: "", checkOut: "" })}
                aria-label="Clear dates"
                className="ml-1 text-gold-deep/70 hover:text-charcoal"
              >
                ✕
              </button>
            </span>
          )}

          <label className="flex items-center gap-2">
            <span className="font-body text-[10px] uppercase tracking-[0.18em] text-warmgrey">
              Guests
            </span>
            <select
              name="guests"
              defaultValue={guests}
              className="border border-line bg-white px-3 py-2 font-body text-xs text-charcoal focus:border-gold focus:outline-none"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="font-body text-[10px] uppercase tracking-[0.18em] text-warmgrey">
              Sort
            </span>
            <select
              name="sort"
              defaultValue={sort}
              className="border border-line bg-white px-3 py-2 font-body text-xs text-charcoal focus:border-gold focus:outline-none"
            >
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>

          <noscript>
            <button type="submit" className="btn btn-outline btn-sm">
              Apply
            </button>
          </noscript>
        </form>
      </div>
    </div>
  );
}
