interface ProgressBarProps {
  ratio: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar = ({ ratio, label, showPercentage = false }: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, Math.round(ratio * 100)));
  const ariaLabel = label || `Progress: ${percentage}%`;
  
  return (
    <div className="progress-wrapper">
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-label={ariaLabel}
      >
        <div 
          className="progress-inner" 
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
      {showPercentage && (
        <span className="progress-label" aria-hidden="true">
          {percentage}%
        </span>
      )}
    </div>
  );
};
