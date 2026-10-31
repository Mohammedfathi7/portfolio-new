import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-36" />
            <Skeleton className="h-11 w-36" />
          </div>
        </div>
        <Skeleton className="aspect-square max-w-md mx-auto w-full rounded-2xl" />
      </div>
    </div>
  );
}
