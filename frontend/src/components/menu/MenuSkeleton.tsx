export function MenuSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-warm-white overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-warm-gray-light" />
          <div className="p-5 flex flex-col gap-3">
            <div className="h-5 bg-warm-gray-light rounded w-2/3" />
            <div className="h-4 bg-warm-gray-light rounded w-full" />
            <div className="h-4 bg-warm-gray-light rounded w-4/5" />
            <div className="h-5 bg-warm-gray-light rounded w-1/4 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
