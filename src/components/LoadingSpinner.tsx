interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

export function LoadingSpinner({ size = "medium", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`${sizeClasses[size]} border-gray-300 border-t-blue-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
