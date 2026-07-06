interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-pink-50">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-pink-400">{description}</p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
