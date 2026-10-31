interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
}

export function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-border/40 bg-muted/20">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="container relative mx-auto px-4 py-16 md:py-20">
        {badge && (
          <span className="mb-4 inline-block rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {badge}
          </span>
        )}
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
