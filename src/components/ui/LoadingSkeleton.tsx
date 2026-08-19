export function CardSkeleton() {
  return (
    <div className="bg-white rounded-card p-4 shadow-card">
      <div className="skeleton h-40 w-full mb-4" />
      <div className="skeleton h-4 w-3/4 mb-2" />
      <div className="skeleton h-3 w-1/2 mb-3" />
      <div className="flex items-center gap-2">
        <div className="skeleton h-6 w-6 rounded-full" />
        <div className="skeleton h-3 w-20" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-card-sm p-4 shadow-card flex items-center gap-4">
          <div className="skeleton h-12 w-12 rounded-xl flex-shrink-0" />
          <div className="flex-1">
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-3 w-1/2" />
          </div>
          <div className="skeleton h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-card p-8 shadow-card">
      <div className="flex items-center gap-6">
        <div className="skeleton h-24 w-24 rounded-full" />
        <div>
          <div className="skeleton h-6 w-48 mb-2" />
          <div className="skeleton h-4 w-32 mb-1" />
          <div className="skeleton h-4 w-40" />
        </div>
      </div>
    </div>
  );
}
