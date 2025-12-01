interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

export function LoadingSpinner({ size = "medium", text }: LoadingSpinnerProps) {
  const sizeClass = size === "small" ? "spinner-small" : size === "large" ? "spinner-large" : "spinner-medium";

  return (
    <div className="loading-container">
      <div
        className={`spinner ${sizeClass}`}
        role="status"
        aria-live="polite"
        aria-label={text || "Loading"}
      >
        <span className="sr-only">{text || "Loading..."}</span>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-item">
          <div className="skeleton-line skeleton-line-title"></div>
          <div className="skeleton-line skeleton-line-subtitle"></div>
        </div>
      ))}
    </div>
  );
}
