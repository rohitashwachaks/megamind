import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error("Uncaught error:", error, errorInfo);

    // In production, you would send this to an error tracking service like Sentry
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="card" style={{ margin: "20px auto", maxWidth: "600px" }}>
          <h2>Something went wrong</h2>
          <p className="muted">
            The application encountered an unexpected error. Please try refreshing the page.
          </p>
          {this.state.error && (
            <details style={{ marginTop: "16px" }}>
              <summary>Error details</summary>
              <pre
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  background: "#f5f5f5",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "12px"
                }}
              >
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ marginTop: "16px" }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
