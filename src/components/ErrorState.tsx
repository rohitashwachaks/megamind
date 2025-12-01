interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState = ({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try Again"
}: ErrorStateProps) => {
  return (
    <div className="card error-card" role="alert" aria-live="assertive">
      <div className="error-content">
        <div className="error-icon" aria-hidden="true">⚠️</div>
        <div className="error-text">
          <h3 className="error-title">{title}</h3>
          <p className="error-message">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button 
          type="button" 
          className="button secondary mt-3" 
          onClick={onRetry}
          aria-label={`${retryLabel} after error`}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
};
