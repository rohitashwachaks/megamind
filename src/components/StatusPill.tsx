type Status =
  | "not_started"
  | "in_progress"
  | "completed"
  | "submitted"
  | "skipped"
  | "active"
  | "parked";

const statusConfig: Record<Status, { bg: string; icon: string; ariaLabel: string }> = {
  not_started: { 
    bg: "rgba(255, 255, 255, 0.08)", 
    icon: "○",
    ariaLabel: "Not started"
  },
  in_progress: { 
    bg: "rgba(78, 161, 255, 0.18)", 
    icon: "◐",
    ariaLabel: "In progress"
  },
  completed: { 
    bg: "rgba(124, 242, 156, 0.2)", 
    icon: "✓",
    ariaLabel: "Completed"
  },
  submitted: { 
    bg: "rgba(124, 242, 156, 0.2)", 
    icon: "✓",
    ariaLabel: "Submitted"
  },
  skipped: { 
    bg: "rgba(255, 142, 92, 0.2)", 
    icon: "⊘",
    ariaLabel: "Skipped"
  },
  active: { 
    bg: "rgba(255, 255, 255, 0.08)", 
    icon: "●",
    ariaLabel: "Active"
  },
  parked: { 
    bg: "rgba(154, 165, 187, 0.18)", 
    icon: "⏸",
    ariaLabel: "Parked"
  }
};

export const StatusPill = ({ status, label }: { status: Status; label?: string }) => {
  const config = statusConfig[status];
  const formatted = label || status.replace("_", " ");
  
  return (
    <span 
      className="status-pill" 
      style={{ background: config.bg }}
      role="status"
      aria-label={`Status: ${config.ariaLabel}`}
    >
      <span aria-hidden="true" className="status-icon">{config.icon}</span>
      <span>{formatted}</span>
    </span>
  );
};
