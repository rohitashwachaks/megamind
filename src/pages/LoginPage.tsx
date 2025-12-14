import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const validateForm = () => {
    if (!isLogin) {
      // Registration validation
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, confirmPassword, displayName);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setConfirmPassword("");
  };

  const setLoginMode = () => {
    if (!isLogin) {
      setIsLogin(true);
      setError("");
      setConfirmPassword("");
    }
  };

  const setRegisterMode = () => {
    if (isLogin) {
      setIsLogin(false);
      setError("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="brand-mark">
            <svg viewBox="0 0 40 40" width="40" height="40">
              <defs>
                <linearGradient id="logo-gradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4ea1ff" />
                  <stop offset="100%" stopColor="#7cf29c" />
                </linearGradient>
              </defs>
              <text x="20" y="28" fontFamily="'Space Grotesk', sans-serif" fontSize="22" fontWeight="800" textAnchor="middle" fill="url(#logo-gradient)">
                PS
              </text>
            </svg>
          </div>
          <h1>PocketSchool</h1>
          <p>Your MIT OCW Companion</p>
        </div>

        <div className="login-card">
          <div className="tab-buttons">
            <button
              type="button"
              onClick={() => setLoginMode()}
              className={`tab-button ${isLogin ? "active" : ""}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setRegisterMode()}
              className={`tab-button ${!isLogin ? "active" : ""}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="displayName">Display Name (optional)</label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
              />
              {!isLogin && (
                <p className="helper-text">Minimum 8 characters</p>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={8}
                />
                <p className="helper-text">Re-enter password to confirm</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <div className="toggle-section">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => toggleMode()}
                className="toggle-button"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>

          <div className="skip-section">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="skip-button"
            >
              Continue without login (Phase 1 mode)
            </button>
          </div>
        </div>

        <p className="phase-info">
          Phase 2: Authentication & Sync enabled
        </p>
      </div>
    </div>
  );
}
