import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

interface Booking {
  id: number;
  customerName: string;
  date: string;
  time: string;
  status: string;
}

interface Plan {
  id: number;
  customerName: string;
  websiteType: string;
  budget: number;
}

interface DashboardData {
  totalCustomers: number;
  totalPlans: number;
  totalBookings: number;
  revenue: number;
  recentBookings: Booking[];
  recentPlans: Plan[];
}

const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#10b981",
  cancelled: "#ef4444",
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("dashboard");

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "plans", label: "Website Plans", icon: "📋" },
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "customers", label: "Customers", icon: "👥" },
  ];

  const stats = data
    ? [
        {
          label: "Total Customers",
          value: data.totalCustomers,
          icon: "👥",
          color: "#2563eb",
          bg: "#eff6ff",
        },
        {
          label: "Website Plans",
          value: data.totalPlans,
          icon: "📋",
          color: "#7c3aed",
          bg: "#f5f3ff",
        },
        {
          label: "Total Bookings",
          value: data.totalBookings,
          icon: "📅",
          color: "#059669",
          bg: "#ecfdf5",
        },
        {
          label: "Revenue",
          value: `₹${data.revenue.toLocaleString("en-IN")}`,
          icon: "₹",
          color: "#d97706",
          bg: "#fffbeb",
        },
      ]
    : [];

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.sidebarLogoIcon}>✦</span>
          <span className={styles.sidebarLogoText}>WebNova</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${
                activeNav === item.id ? styles.navItemActive : ""
              }`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          className={styles.logoutBtn}
          onClick={() => navigate("/admin/login")}
        >
          <span>⇠</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* ── Main Content ── */}
      <div className={styles.main}>
        {/* Top Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Dashboard</h1>
            <p className={styles.headerDate}>{today}</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.adminBadge}>
              <span className={styles.adminAvatar}>A</span>
              <span className={styles.adminName}>Admin</span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className={styles.body}>
          {loading && (
            <div className={styles.stateBox}>
              <span className={styles.spinner} />
              <p>Loading dashboard data…</p>
            </div>
          )}

          {error && (
            <div className={styles.stateBox}>
              <p className={styles.errorText}>⚠ {error}</p>
              <p className={styles.errorSub}>
                Make sure the backend is running and the API is reachable.
              </p>
            </div>
          )}

          {!loading && !error && data && (
            <>
              {/* Stat Cards */}
              <div className={styles.statsGrid}>
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className={styles.statCard}
                    style={{ "--card-accent": s.color, "--card-bg": s.bg } as React.CSSProperties}
                  >
                    <div
                      className={styles.statIcon}
                      style={{ background: s.bg, color: s.color }}
                    >
                      {s.icon}
                    </div>
                    <div className={styles.statInfo}>
                      <p className={styles.statValue}>{s.value}</p>
                      <p className={styles.statLabel}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tables row */}
              <div className={styles.tablesRow}>
                {/* Recent Bookings */}
                <div className={styles.tableCard}>
                  <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Recent Bookings</h2>
                    <span className={styles.tableBadge}>
                      {data.recentBookings.length} entries
                    </span>
                  </div>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentBookings.length === 0 ? (
                          <tr>
                            <td colSpan={4} className={styles.emptyCell}>
                              No bookings yet
                            </td>
                          </tr>
                        ) : (
                          data.recentBookings.map((b) => (
                            <tr key={b.id}>
                              <td className={styles.nameCell}>{b.customerName}</td>
                              <td>{b.date}</td>
                              <td>{b.time}</td>
                              <td>
                                <span
                                  className={styles.statusBadge}
                                  style={{
                                    background:
                                      (statusColor[b.status] || "#64748b") + "18",
                                    color:
                                      statusColor[b.status] || "#64748b",
                                    borderColor:
                                      (statusColor[b.status] || "#64748b") + "40",
                                  }}
                                >
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Plans */}
                <div className={styles.tableCard}>
                  <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Recent Website Plans</h2>
                    <span className={styles.tableBadge}>
                      {data.recentPlans.length} entries
                    </span>
                  </div>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Website Type</th>
                          <th>Budget</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentPlans.length === 0 ? (
                          <tr>
                            <td colSpan={3} className={styles.emptyCell}>
                              No plans yet
                            </td>
                          </tr>
                        ) : (
                          data.recentPlans.map((p) => (
                            <tr key={p.id}>
                              <td className={styles.nameCell}>{p.customerName}</td>
                              <td>{p.websiteType}</td>
                              <td className={styles.budgetCell}>
                                ₹{Number(p.budget).toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
