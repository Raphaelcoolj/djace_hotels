export type AdminStat = {
  label: string;
  value: string;
  hint?: string;
};

export default function AdminStats({ stats }: { stats: AdminStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-ivory p-5">
          <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-warmgrey">
            {stat.label}
          </p>
          <p className="mt-3 font-heading text-2xl leading-none text-charcoal md:text-[27px]">
            {stat.value}
          </p>
          {stat.hint && (
            <p className="mt-2 font-body text-[11px] leading-snug text-warmgrey">
              {stat.hint}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
