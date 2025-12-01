interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon = "📚",
  title,
  description,
  actionLabel,
  actionLink,
  onAction
}: EmptyStateProps) => {
  return (
    <div className="empty-state" role="status" aria-label={title}>
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {actionLabel && (
        actionLink ? (
          <a href={actionLink} className="button">
            {actionLabel}
          </a>
        ) : onAction ? (
          <button type="button" className="button" onClick={onAction}>
            {actionLabel}
          </button>
        ) : null
      )}
    </div>
  );
};
