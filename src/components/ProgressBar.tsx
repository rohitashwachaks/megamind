export const ProgressBar = ({ ratio }: { ratio: number }) => {
  const width = Math.min(100, Math.max(0, Math.round(ratio * 100)));
  return (
    <div className="progress" aria-label="Progress">
      <div className="progress-inner" style={{ width: `${width}%` }} />
    </div>
  );
};
