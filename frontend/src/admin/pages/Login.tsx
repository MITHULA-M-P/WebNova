import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/admin/dashboard"), 600);
  };

  return (
    <div className={styles.wrapper}>
      {/* Left: Brand Panel */}
      <div className={styles.brand}>
        <div className={styles.brandContent}>
          <p className={styles.logoText}>✦ WebNova</p>
          <h1 className={styles.brandHeading}>Admin Portal</h1>
          <p className={styles.brandSub}>
            Manage clients, bookings, and website plans — all from one place.
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
              <span className={styles.statLabel}>Private Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSub}>Sign in to access your dashboard</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="admin-email" className={styles.label}>
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                className={styles.input}
                placeholder="admin@webnova.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <p className={styles.disclaimer}>
            Admin access only. JWT authentication will be enforced soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

