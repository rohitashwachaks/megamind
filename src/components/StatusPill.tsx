type Status =
  | "not_started"
  | "in_progress"
  | "completed"
  | "submitted"
  | "skipped"
  | "active"
  | "parked";

const statusStyles: Record<Status, string> = {
  not_started: "rgba(255, 255, 255, 0.08)",
  in_progress: "rgba(78, 161, 255, 0.18)",
  completed: "rgba(124, 242, 156, 0.2)",
  submitted: "rgba(124, 242, 156, 0.2)",
  skipped: "rgba(255, 142, 92, 0.2)",
  active: "rgba(255, 255, 255, 0.08)",
  parked: "rgba(154, 165, 187, 0.18)"
};

export const StatusPill = ({ status, label }: { status: Status; label?: string }) => {
  const formatted = label || status.replace("_", " ");
  return (
    <span className="status-pill" style={{ background: statusStyles[status] || undefined }}>
      {formatted}
    </span>
  );
};
