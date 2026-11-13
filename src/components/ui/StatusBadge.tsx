const STATUS_STYLES: Record<
  string,
  { label: string; className: string }
> = {
  pending_approval: {
    label: "Pending confirmation",
    className: "bg-cream text-charcoal border border-line",
  },
  approved_awaiting_payment: {
    label: "Awaiting payment",
    className: "bg-gold/15 text-gold-deep border border-gold/40",
  },
  paid_confirmed: {
    label: "Confirmed",
    className: "bg-forest text-ivory border border-forest",
  },
  declined: {
    label: "Declined",
    className: "bg-danger/10 text-danger border border-danger/30",
  },
};

const STATUS_NEXT_STEPS: Record<string, string> = {
  pending_approval:
    "Your reservation request has been received. The hotel will confirm availability shortly.",
  approved_awaiting_payment:
    "Your reservation is approved. Complete payment using the bank details below, then submit your transaction reference for review.",
  paid_confirmed:
    "Payment received and your stay is confirmed. A receipt is available via WhatsApp from your reservation.",
  declined:
    "This reservation could not be accommodated. Please contact us or try alternative dates.",
};

export function statusLabel(status: string) {
  return STATUS_STYLES[status]?.label ?? status.replace(/_/g, " ");
}

export function statusNextSteps(status: string) {
  return (
    STATUS_NEXT_STEPS[status] ??
    "Please contact the hotel if you have any questions about this reservation."
  );
}

export default function StatusBadge({
  status,
  className = "",
}: {
  status: string;
  className?: string;
}) {
  const style = STATUS_STYLES[status] ?? {
    label: status.replace(/_/g, " "),
    className: "bg-cream text-charcoal border border-line",
  };

  return (
    <span
      className={`inline-flex items-center px-3.5 py-1.5 font-body text-[10px] font-medium uppercase tracking-[0.18em] ${style.className} ${className}`}
    >
      {style.label}
    </span>
  );
}
