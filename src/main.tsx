import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AppStateProvider } from "./state/AppStateContext";
import { AuthProvider } from "./auth/AuthContext";
import { registerServiceWorker } from "./serviceWorkerRegistration";
import { ErrorBoundary } from "./components/ErrorBoundary";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppStateProvider>
            <App />
          </AppStateProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

registerServiceWorker();
