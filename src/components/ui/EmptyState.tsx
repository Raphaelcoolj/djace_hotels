import Link from "next/link";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
};

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
  children,
}: EmptyStateProps) {
  return (
    <div className="card px-8 py-16 text-center">
      <div className="mx-auto mb-6 h-px w-12 bg-gold" aria-hidden />
      <h3 className="heading-md text-charcoal mb-3">{title}</h3>
      <p className="body-sm max-w-md mx-auto mb-8">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-gold">
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}
