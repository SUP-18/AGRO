export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  const skeletons = {
    card: () => (
      <div className="glass-card p-5 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="h-3 bg-dark-700 rounded-full w-24" />
            <div className="h-6 bg-dark-700 rounded-full w-16" />
            <div className="h-2 bg-dark-700 rounded-full w-32" />
          </div>
          <div className="w-12 h-12 bg-dark-700 rounded-xl" />
        </div>
      </div>
    ),
    text: () => (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-dark-700 rounded-full w-3/4" />
        <div className="h-4 bg-dark-700 rounded-full w-1/2" />
        <div className="h-4 bg-dark-700 rounded-full w-5/6" />
      </div>
    ),
    chart: () => (
      <div className="glass-card p-5 animate-pulse">
        <div className="h-4 bg-dark-700 rounded-full w-32 mb-4" />
        <div className="h-64 bg-dark-700/50 rounded-xl" />
      </div>
    ),
    table: () => (
      <div className="glass-card p-5 animate-pulse space-y-3">
        <div className="h-8 bg-dark-700 rounded-lg" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-dark-700/50 rounded-lg" />
        ))}
      </div>
    ),
  };

  const Skeleton = skeletons[type] || skeletons.card;

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} />
      ))}
    </>
  );
}
