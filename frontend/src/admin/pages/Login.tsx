import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import styles from "./Login.module.css";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Invalid email or password");
      }

      // Store JWT token securely in localStorage
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify({ name: data.admin?.name || "Admin", email: data.admin?.email || email }));
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Theme toggle – top right corner */}
      <button
        type="button"
        className={styles.themeToggle}
        onClick={toggleTheme}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      {/* Left: Brand Panel */}
      <div className={styles.brand}>
        <div className={styles.brandContent}>
          <p className={styles.logoText}>✦ WebNova</p>
          <h1 className={styles.brandHeading}>Admin Portal</h1>
          <p className={styles.brandSub}>
            Manage clients, bookings, portfolio, pricing plans, and website settings — all from one place.
          </p>
          <div className={styles.brandStats}>
            <div className={styles.brandStat}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Data Accuracy</span>
            </div>
            <div className={styles.brandStat}>
              <span className={styles.statNum}>Live</span>
              <span className={styles.statLabel}>Real-time Stats</span>
            </div>
            <div className={styles.brandStat}>
              <span className={styles.statNum}>Secure</span>
              <span className={styles.statLabel}>JWT Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSub}>Sign in to access your admin dashboard</p>

          {error && (
            <div className={styles.errorAlert}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="admin-email" className={styles.label}>
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                className={styles.input}
                placeholder="admin@webnova.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="admin-password" className={styles.label}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.btnLoader} />
              ) : (
                "Sign In to Dashboard →"
              )}
            </button>
          </form>

          <p className={styles.disclaimer}>
            Admin access only. Default: admin@webnova.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
