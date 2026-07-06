interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-pink-500/30 bg-pink-950/30 px-8 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/10 ring-1 ring-pink-400/20">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-pink-100">{title}</h3>
      <p className="max-w-sm text-sm text-pink-400">{description}</p>
    </div>
  );
}
