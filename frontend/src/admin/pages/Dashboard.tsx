import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import styles from "./Dashboard.module.css";

// Type definitions
interface Booking {
  id: number;
  customerId?: number;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  status: string;
  message?: string;
  createdAt?: string;
}

interface TimeSlot {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string;
  image_url: string;
  github_url?: string;
  live_url?: string;
  is_featured: boolean;
}

interface PricingPlan {
  id: number;
  title: string;
  description: string;
  price: number;
  billing_cycle: string;
  is_active: boolean;
  is_popular: boolean;
  features: Array<{ id?: number; feature_name: string; is_included: boolean }>;
}

interface WebsiteSettings {
  id?: number;
  company_name: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  contact_email: string;
  phone_number: string;
  office_address: string;
  social_twitter?: string;
  social_github?: string;
  social_linkedin?: string;
  social_instagram?: string;
  footer_text: string;
  logo_url?: string;
  favicon_url?: string;
}

interface StatisticItem {
  id: number;
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  icon?: string;
  display_order?: number;
}

interface DashboardSummary {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  projectsCompleted: number;
  availableSlotsToday: number;
}

interface DashboardCharts {
  bookingTrends: { labels: string[]; data: number[] };
  statusDistribution: Array<{ status: string; count: number; color: string }>;
  monthlyProjects: { labels: string[]; completed: number[] };
}

const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#10b981",
  cancelled: "#ef4444",
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Authentication check on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  // Shadow global fetch to append JWT token and handle 401 Unauthorized
  const fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const token = localStorage.getItem("admin_token");
    const headers = new Headers(init?.headers);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    const response = await window.fetch(input, {
      ...init,
      headers,
    });
    if (response.status === 401) {
      localStorage.removeItem("admin_token");
      navigate("/admin/login", { replace: true });
    }
    return response;
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "slots" | "portfolio" | "plans" | "settings" | "statistics"
  >("overview");

  // Global Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── 1. OVERVIEW DATA ──
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const fetchOverview = () => {
    setLoadingOverview(true);
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((json) => {
        setSummary(json.summary);
        setCharts(json.charts);
        setRecentBookings(json.recentBookings || []);
      })
      .catch((err) => console.error("Error fetching dashboard overview:", err))
      .finally(() => setLoadingOverview(false));
  };

  useEffect(() => {
    if (localStorage.getItem("admin_token")) {
      fetchOverview();
    }
  }, []);

  // ── 2. BOOKINGS TAB DATA & ACTIONS ──
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [bookingDateFilter, setBookingDateFilter] = useState("");
  const [bookingPage, setBookingPage] = useState(1);
  const [totalBookingPages, setTotalBookingPages] = useState(1);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Booking Detail Modal & Delete Confirmation Dialog
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<number | null>(null);

  const fetchBookings = () => {
    setLoadingBookings(true);
    const query = new URLSearchParams({
      search: bookingSearch,
      status: bookingStatusFilter,
      date: bookingDateFilter,
      page: String(bookingPage),
      limit: "8",
    });
    fetch(`/api/admin/bookings?${query.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setBookings(json.data || []);
        if (json.pagination) {
          setTotalBookingPages(json.pagination.totalPages || 1);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingBookings(false));
  };

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab, bookingSearch, bookingStatusFilter, bookingDateFilter, bookingPage]);

  const handleUpdateBookingStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Booking #${id} updated to ${newStatus}`);
        fetchBookings();
        fetchOverview();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(`Booking #${id} deleted`);
        setDeleteBookingId(null);
        fetchBookings();
        fetchOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── 3. SLOT MANAGEMENT DATA & ACTIONS ──
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [slotForm, setSlotForm] = useState({ day_of_week: "all", start_time: "", end_time: "", is_active: true });

  const fetchSlots = () => {
    fetch("/api/admin/slots")
      .then((res) => res.json())
      .then((json) => setSlots(json || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (activeTab === "slots") fetchSlots();
  }, [activeTab]);

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingSlot ? "PUT" : "POST";
    const url = editingSlot ? `/api/admin/slots/${editingSlot.id}` : "/api/admin/slots";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slotForm),
      });
      if (res.ok) {
        showToast(editingSlot ? "Slot updated" : "New slot added");
        setSlotModalOpen(false);
        setEditingSlot(null);
        fetchSlots();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSlot = async (slot: TimeSlot) => {
    try {
      const res = await fetch(`/api/admin/slots/${slot.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !slot.is_active }),
      });
      if (res.ok) {
        showToast(`Slot ${slot.start_time} ${!slot.is_active ? "enabled" : "disabled"}`);
        fetchSlots();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlot = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/slots/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Slot deleted");
        fetchSlots();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── 4. PORTFOLIO MANAGEMENT DATA & ACTIONS ──
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    description: "",
    category: "Web Application",
    technologies: "",
    image_url: "",
    github_url: "",
    live_url: "",
    is_featured: false,
  });

  const fetchPortfolios = () => {
    fetch("/api/admin/portfolio")
      .then((res) => res.json())
      .then((json) => setPortfolios(json || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (activeTab === "portfolio") fetchPortfolios();
  }, [activeTab]);

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingPortfolio ? "PUT" : "POST";
    const url = editingPortfolio ? `/api/admin/portfolio/${editingPortfolio.id}` : "/api/admin/portfolio";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioForm),
      });
      if (res.ok) {
        showToast(editingPortfolio ? "Portfolio updated" : "Project added");
        setPortfolioModalOpen(false);
        setEditingPortfolio(null);
        fetchPortfolios();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Project deleted");
        fetchPortfolios();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── 5. WEBSITE PLANS DATA & ACTIONS ──
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [planForm, setPlanForm] = useState({
    title: "",
    description: "",
    price: 0,
    billing_cycle: "one-time",
    is_active: true,
    is_popular: false,
    featuresText: "",
  });

  const fetchPlans = () => {
    fetch("/api/admin/plans")
      .then((res) => res.json())
      .then((json) => setPlans(json || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (activeTab === "plans") fetchPlans();
  }, [activeTab]);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingPlan ? "PUT" : "POST";
    const url = editingPlan ? `/api/admin/plans/${editingPlan.id}` : "/api/admin/plans";
    const featuresList = planForm.featuresText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((f) => ({ feature_name: f, is_included: true }));

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...planForm,
          price: Number(planForm.price),
          features: featuresList,
        }),
      });
      if (res.ok) {
        showToast(editingPlan ? "Plan updated" : "Plan created");
        setPlanModalOpen(false);
        setEditingPlan(null);
        fetchPlans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlan = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Plan deleted");
        fetchPlans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── 6. WEBSITE SETTINGS DATA & ACTIONS ──
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>({
    company_name: "WebNova",
    hero_title: "We Build High-Converting Custom Websites",
    hero_subtitle: "Transforming your digital presence with modern web design and seamless development.",
    about_text: "WebNova is a premier digital agency building sleek, high-performing websites.",
    contact_email: "contact@webnova.in",
    phone_number: "+91 98765 43210",
    office_address: "123 Tech Park, Innovation Way, Bangalore, India",
    social_twitter: "",
    social_github: "",
    social_linkedin: "",
    social_instagram: "",
    footer_text: "© 2026 WebNova Studio. All rights reserved.",
    logo_url: "",
    favicon_url: "",
  });

  const fetchSettings = () => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json) setSettingsForm(json);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (activeTab === "settings") fetchSettings();
  }, [activeTab]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        showToast("Website settings saved!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── 7. STATISTICS DATA & ACTIONS ──
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);
  const [statModalOpen, setStatModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<StatisticItem | null>(null);
  const [statForm, setStatForm] = useState({ label: "", value: "", prefix: "", suffix: "", icon: "📊", display_order: 1 });

  const fetchStatistics = () => {
    fetch("/api/admin/statistics")
      .then((res) => res.json())
      .then((json) => setStatistics(json || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (activeTab === "statistics") fetchStatistics();
  }, [activeTab]);

  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingStat ? "PUT" : "POST";
    const url = editingStat ? `/api/admin/statistics/${editingStat.id}` : "/api/admin/statistics";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statForm),
      });
      if (res.ok) {
        showToast(editingStat ? "Statistic updated" : "Statistic added");
        setStatModalOpen(false);
        setEditingStat(null);
        fetchStatistics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStat = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/statistics/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Statistic deleted");
        fetchStatistics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { id: "overview", label: "Dashboard", icon: "⊞" },
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "slots", label: "Slot Management", icon: "⏰" },
    { id: "portfolio", label: "Portfolio", icon: "🎨" },
    { id: "plans", label: "Website Plans", icon: "📋" },
    { id: "settings", label: "Website Settings", icon: "⚙️" },
    { id: "statistics", label: "Homepage Stats", icon: "📊" },
  ];

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.shell}>
      {/* ── Toast Alert ── */}
      {toast && <div className={styles.toast}>✓ {toast}</div>}

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.sidebarLogoIcon}>✦</span>
          <span className={styles.sidebarLogoText}>WebNova Admin</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ""}`}
              onClick={() => setActiveTab(item.id as any)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          className={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
            navigate("/admin/login", { replace: true });
          }}
        >
          <span>⇠</span>
          <span>Sign Out</span>
        </button>
      </aside>

      {/* ── Main Panel ── */}
      <div className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>
              {navItems.find((n) => n.id === activeTab)?.label || "Dashboard"}
            </h1>
            <p className={styles.headerDate}>{todayFormatted}</p>
          </div>

          <div className={styles.headerRight}>
            <button className={styles.themeToggleHeaderBtn} onClick={toggleTheme} title="Toggle Theme">
              <span>{theme === "light" ? "🌙" : "☀️"}</span>
              <span>{theme === "light" ? "Dark" : "Light"}</span>
            </button>

            <div className={styles.adminBadge}>
              <span className={styles.adminAvatar}>A</span>
              <span className={styles.adminName}>Super Admin</span>
            </div>
          </div>
        </header>

        <div className={styles.body}>
          {/* ═════════════════════════════════════════
              TAB 1: OVERVIEW
             ═════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <>
              {loadingOverview ? (
                <div className={styles.stateBox}>
                  <div className={styles.spinner} />
                  <p>Loading summary & analytics data…</p>
                </div>
              ) : (
                <>
                  {/* 6 Summary Cards */}
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon} style={{ background: "#eff6ff", color: "#2563eb" }}>📅</div>
                      <div>
                        <p className={styles.statValue}>{summary?.totalBookings || 0}</p>
                        <p className={styles.statLabel}>Total Bookings</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon} style={{ background: "#fffbeb", color: "#d97706" }}>⏳</div>
                      <div>
                        <p className={styles.statValue}>{summary?.pendingBookings || 0}</p>
                        <p className={styles.statLabel}>Pending Bookings</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon} style={{ background: "#ecfdf5", color: "#059669" }}>✅</div>
                      <div>
                        <p className={styles.statValue}>{summary?.confirmedBookings || 0}</p>
                        <p className={styles.statLabel}>Confirmed Bookings</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon} style={{ background: "#fef2f2", color: "#dc2626" }}>❌</div>
                      <div>
                        <p className={styles.statValue}>{summary?.cancelledBookings || 0}</p>
                        <p className={styles.statLabel}>Cancelled Bookings</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon} style={{ background: "#f5f3ff", color: "#7c3aed" }}>🚀</div>
                      <div>
                        <p className={styles.statValue}>{summary?.projectsCompleted || 0}</p>
                        <p className={styles.statLabel}>Projects Completed</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon} style={{ background: "#e0f2fe", color: "#0284c7" }}>⏰</div>
                      <div>
                        <p className={styles.statValue}>{summary?.availableSlotsToday || 0}</p>
                        <p className={styles.statLabel}>Available Slots Today</p>
                      </div>
                    </div>
                  </div>

                  {/* SVG Charts */}
                  <div className={styles.chartsGrid}>
                    {/* Booking Trends Bar/Line Chart */}
                    <div className={styles.chartCard}>
                      <h2 className={styles.chartTitle}>📈 Booking Trends (Last 7 Days)</h2>
                      <div style={{ height: "200px", display: "flex", alignItems: "flex-end", gap: "20px", padding: "20px 10px 0" }}>
                        {charts?.bookingTrends.labels.map((lbl, idx) => {
                          const val = charts.bookingTrends.data[idx] || 0;
                          const maxVal = Math.max(...charts.bookingTrends.data, 5);
                          const heightPct = Math.min(100, Math.max(15, (val / maxVal) * 100));
                          return (
                            <div key={lbl} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--primary)" }}>{val}</span>
                              <div
                                style={{
                                  width: "100%",
                                  maxWidth: "36px",
                                  height: `${heightPct}%`,
                                  background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
                                  borderRadius: "6px 6px 0 0",
                                  transition: "height 0.4s ease",
                                }}
                              />
                              <span style={{ fontSize: "12px", color: "var(--muted)" }}>{lbl}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Status Distribution */}
                    <div className={styles.chartCard}>
                      <h2 className={styles.chartTitle}>🍩 Status Breakdown</h2>
                      <div style={{ padding: "10px 0" }}>
                        {charts?.statusDistribution.map((item) => {
                          const total = summary?.totalBookings || 1;
                          const pct = Math.round((item.count / total) * 100) || 0;
                          return (
                            <div key={item.status} style={{ marginBottom: "16px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                                <span style={{ fontWeight: 600, color: "var(--secondary)" }}>{item.status}</span>
                                <span style={{ color: "var(--muted)" }}>{item.count} ({pct}%)</span>
                              </div>
                              <div style={{ height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                                <div style={{ width: `${pct}%`, height: "100%", background: item.color }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings Table */}
                  <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                      <h2 className={styles.tableTitle}>Recent Booking Activity</h2>
                      <button className={styles.btnSm} style={{ background: "var(--primary)", color: "#fff" }} onClick={() => setActiveTab("bookings")}>
                        View All Bookings
                      </button>
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
                          {recentBookings.length === 0 ? (
                            <tr><td colSpan={4} className={styles.emptyCell}>No bookings recorded yet.</td></tr>
                          ) : (
                            recentBookings.map((b) => (
                              <tr key={b.id}>
                                <td className={styles.nameCell}>{b.customerName}</td>
                                <td>{b.date}</td>
                                <td>{b.time}</td>
                                <td>
                                  <span
                                    className={styles.statusBadge}
                                    style={{
                                      background: (statusColor[b.status] || "#64748b") + "18",
                                      color: statusColor[b.status] || "#64748b",
                                      borderColor: (statusColor[b.status] || "#64748b") + "40",
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
                </>
              )}
            </>
          )}

          {/* ═════════════════════════════════════════
              TAB 2: BOOKING MANAGEMENT
             ═════════════════════════════════════════ */}
          {activeTab === "bookings" && (
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2 className={styles.tableTitle}>All Customer Bookings</h2>
                <div className={styles.tableFilters}>
                  <input
                    type="text"
                    placeholder="Search name/email/phone..."
                    className={styles.filterInput}
                    value={bookingSearch}
                    onChange={(e) => { setBookingSearch(e.target.value); setBookingPage(1); }}
                  />
                  <select
                    className={styles.filterSelect}
                    value={bookingStatusFilter}
                    onChange={(e) => { setBookingStatusFilter(e.target.value); setBookingPage(1); }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <input
                    type="date"
                    className={styles.filterInput}
                    value={bookingDateFilter}
                    onChange={(e) => { setBookingDateFilter(e.target.value); setBookingPage(1); }}
                  />
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingBookings ? (
                      <tr><td colSpan={8} className={styles.emptyCell}>Loading bookings...</td></tr>
                    ) : bookings.length === 0 ? (
                      <tr><td colSpan={8} className={styles.emptyCell}>No matching bookings found.</td></tr>
                    ) : (
                      bookings.map((b) => (
                        <tr key={b.id}>
                          <td style={{ fontWeight: "bold" }}>#{b.id}</td>
                          <td className={styles.nameCell}>{b.customerName}</td>
                          <td>{b.email}</td>
                          <td>{b.phone}</td>
                          <td>{b.date}</td>
                          <td>{b.time}</td>
                          <td>
                            <span
                              className={styles.statusBadge}
                              style={{
                                background: (statusColor[b.status] || "#64748b") + "18",
                                color: statusColor[b.status] || "#64748b",
                                borderColor: (statusColor[b.status] || "#64748b") + "40",
                              }}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionBtns}>
                              <button className={`${styles.btnSm} ${styles.btnView}`} onClick={() => setSelectedBooking(b)}>
                                View
                              </button>
                              {b.status !== "confirmed" && (
                                <button className={`${styles.btnSm} ${styles.btnConfirm}`} onClick={() => handleUpdateBookingStatus(b.id, "confirmed")}>
                                  Confirm
                                </button>
                              )}
                              {b.status !== "cancelled" && (
                                <button className={`${styles.btnSm} ${styles.btnCancel}`} onClick={() => handleUpdateBookingStatus(b.id, "cancelled")}>
                                  Cancel
                                </button>
                              )}
                              <button className={`${styles.btnSm} ${styles.btnDelete}`} onClick={() => setDeleteBookingId(b.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className={styles.pagination}>
                <span>Page {bookingPage} of {totalBookingPages}</span>
                <div className={styles.pageBtns}>
                  <button
                    disabled={bookingPage <= 1}
                    className={styles.filterInput}
                    onClick={() => setBookingPage((p) => Math.max(1, p - 1))}
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={bookingPage >= totalBookingPages}
                    className={styles.filterInput}
                    onClick={() => setBookingPage((p) => Math.min(totalBookingPages, p + 1))}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB 3: SLOT MANAGEMENT
             ═════════════════════════════════════════ */}
          {activeTab === "slots" && (
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2 className={styles.tableTitle}>Available Appointment Time Slots</h2>
                <button
                  className={styles.btnPrimary}
                  onClick={() => {
                    setEditingSlot(null);
                    setSlotForm({ day_of_week: "all", start_time: "", end_time: "", is_active: true });
                    setSlotModalOpen(true);
                  }}
                >
                  + Add New Slot
                </button>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Day Configuration</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.length === 0 ? (
                      <tr><td colSpan={6} className={styles.emptyCell}>No slots configured yet.</td></tr>
                    ) : (
                      slots.map((s) => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: "bold" }}>#{s.id}</td>
                          <td style={{ textTransform: "capitalize" }}>{s.day_of_week}</td>
                          <td style={{ fontWeight: 600 }}>{s.start_time}</td>
                          <td>{s.end_time}</td>
                          <td>
                            <span
                              className={styles.statusBadge}
                              style={{
                                background: s.is_active ? "#ecfdf5" : "#fef2f2",
                                color: s.is_active ? "#059669" : "#dc2626",
                                borderColor: s.is_active ? "#a7f3d0" : "#fecaca",
                              }}
                            >
                              {s.is_active ? "Enabled" : "Disabled"}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionBtns}>
                              <button
                                className={`${styles.btnSm} ${s.is_active ? styles.btnCancel : styles.btnConfirm}`}
                                onClick={() => handleToggleSlot(s)}
                              >
                                {s.is_active ? "Disable" : "Enable"}
                              </button>
                              <button
                                className={`${styles.btnSm} ${styles.btnEdit}`}
                                onClick={() => {
                                  setEditingSlot(s);
                                  setSlotForm({
                                    day_of_week: s.day_of_week,
                                    start_time: s.start_time,
                                    end_time: s.end_time,
                                    is_active: s.is_active,
                                  });
                                  setSlotModalOpen(true);
                                }}
                              >
                                Edit
                              </button>
                              <button className={`${styles.btnSm} ${styles.btnDelete}`} onClick={() => handleDeleteSlot(s.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB 4: PORTFOLIO MANAGEMENT
             ═════════════════════════════════════════ */}
          {activeTab === "portfolio" && (
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2 className={styles.tableTitle}>Portfolio Showcase Projects</h2>
                <button
                  className={styles.btnPrimary}
                  onClick={() => {
                    setEditingPortfolio(null);
                    setPortfolioForm({
                      title: "",
                      description: "",
                      category: "Web Application",
                      technologies: "React, Node.js, PostgreSQL",
                      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
                      github_url: "https://github.com/webnova",
                      live_url: "https://webnova.in",
                      is_featured: false,
                    });
                    setPortfolioModalOpen(true);
                  }}
                >
                  + Add Project
                </button>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Category</th>
                      <th>Technologies</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolios.length === 0 ? (
                      <tr><td colSpan={5} className={styles.emptyCell}>No portfolio projects created.</td></tr>
                    ) : (
                      portfolios.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <img src={p.image_url} alt={p.title} style={{ width: "48px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
                              <div>
                                <p className={styles.nameCell}>{p.title}</p>
                                <p style={{ fontSize: "12px", color: "var(--muted)" }}>{p.description.substring(0, 50)}...</p>
                              </div>
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td>{p.technologies}</td>
                          <td>{p.is_featured ? "⭐ Yes" : "No"}</td>
                          <td>
                            <div className={styles.actionBtns}>
                              <button
                                className={`${styles.btnSm} ${styles.btnEdit}`}
                                onClick={() => {
                                  setEditingPortfolio(p);
                                  setPortfolioForm({
                                    title: p.title,
                                    description: p.description,
                                    category: p.category,
                                    technologies: p.technologies,
                                    image_url: p.image_url,
                                    github_url: p.github_url || "",
                                    live_url: p.live_url || "",
                                    is_featured: p.is_featured,
                                  });
                                  setPortfolioModalOpen(true);
                                }}
                              >
                                Edit
                              </button>
                              <button className={`${styles.btnSm} ${styles.btnDelete}`} onClick={() => handleDeletePortfolio(p.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB 5: WEBSITE PLANS
             ═════════════════════════════════════════ */}
          {activeTab === "plans" && (
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2 className={styles.tableTitle}>Configurable Pricing Plans</h2>
                <button
                  className={styles.btnPrimary}
                  onClick={() => {
                    setEditingPlan(null);
                    setPlanForm({
                      title: "",
                      description: "",
                      price: 19999,
                      billing_cycle: "one-time",
                      is_active: true,
                      is_popular: false,
                      featuresText: "Custom Page Design\nResponsive Layout\nSEO Optimization",
                    });
                    setPlanModalOpen(true);
                  }}
                >
                  + Add Plan
                </button>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Plan Title</th>
                      <th>Price</th>
                      <th>Billing Cycle</th>
                      <th>Features</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.length === 0 ? (
                      <tr><td colSpan={6} className={styles.emptyCell}>No website plans added yet.</td></tr>
                    ) : (
                      plans.map((p) => (
                        <tr key={p.id}>
                          <td className={styles.nameCell}>{p.title} {p.is_popular ? "🔥" : ""}</td>
                          <td className={styles.budgetCell}>₹{Number(p.price).toLocaleString("en-IN")}</td>
                          <td style={{ textTransform: "capitalize" }}>{p.billing_cycle}</td>
                          <td>{p.features?.length || 0} features</td>
                          <td>
                            <span className={styles.statusBadge} style={{ background: p.is_active ? "#ecfdf5" : "#fef2f2", color: p.is_active ? "#059669" : "#dc2626" }}>
                              {p.is_active ? "Active" : "Hidden"}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionBtns}>
                              <button
                                className={`${styles.btnSm} ${styles.btnEdit}`}
                                onClick={() => {
                                  setEditingPlan(p);
                                  setPlanForm({
                                    title: p.title,
                                    description: p.description,
                                    price: p.price,
                                    billing_cycle: p.billing_cycle,
                                    is_active: p.is_active,
                                    is_popular: p.is_popular,
                                    featuresText: p.features ? p.features.map((f) => f.feature_name).join("\n") : "",
                                  });
                                  setPlanModalOpen(true);
                                }}
                              >
                                Edit
                              </button>
                              <button className={`${styles.btnSm} ${styles.btnDelete}`} onClick={() => handleDeletePlan(p.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB 6: WEBSITE SETTINGS
             ═════════════════════════════════════════ */}
          {activeTab === "settings" && (
            <div className={styles.tableCard} style={{ padding: "2rem" }}>
              <h2 className={styles.tableTitle} style={{ marginBottom: "1.5rem" }}>⚙️ Global Dynamic Website Settings</h2>

              <form onSubmit={handleSaveSettings}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Company Name</label>
                    <input
                      className={styles.formInput}
                      value={settingsForm.company_name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Contact Email</label>
                    <input
                      className={styles.formInput}
                      type="email"
                      value={settingsForm.contact_email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Homepage Hero Title</label>
                  <input
                    className={styles.formInput}
                    value={settingsForm.hero_title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Homepage Hero Subtitle</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={2}
                    value={settingsForm.hero_subtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>About Section Description</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={3}
                    value={settingsForm.about_text}
                    onChange={(e) => setSettingsForm({ ...settingsForm, about_text: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input
                      className={styles.formInput}
                      value={settingsForm.phone_number}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone_number: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Office Address</label>
                    <input
                      className={styles.formInput}
                      value={settingsForm.office_address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, office_address: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Twitter / X Profile URL</label>
                    <input
                      className={styles.formInput}
                      value={settingsForm.social_twitter || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, social_twitter: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>GitHub Organization URL</label>
                    <input
                      className={styles.formInput}
                      value={settingsForm.social_github || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, social_github: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Footer Copyright Text</label>
                  <input
                    className={styles.formInput}
                    value={settingsForm.footer_text}
                    onChange={(e) => setSettingsForm({ ...settingsForm, footer_text: e.target.value })}
                  />
                </div>

                <button type="submit" className={styles.btnPrimary} style={{ marginTop: "1rem" }}>
                  Save Website Settings
                </button>
              </form>
            </div>
          )}

          {/* ═════════════════════════════════════════
              TAB 7: STATISTICS MANAGEMENT
             ═════════════════════════════════════════ */}
          {activeTab === "statistics" && (
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2 className={styles.tableTitle}>Homepage Dynamic Counter Statistics</h2>
                <button
                  className={styles.btnPrimary}
                  onClick={() => {
                    setEditingStat(null);
                    setStatForm({ label: "", value: "100", prefix: "", suffix: "+", icon: "🚀", display_order: statistics.length + 1 });
                    setStatModalOpen(true);
                  }}
                >
                  + Add Statistic
                </button>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Icon</th>
                      <th>Label</th>
                      <th>Display Value</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.length === 0 ? (
                      <tr><td colSpan={5} className={styles.emptyCell}>No statistics configured.</td></tr>
                    ) : (
                      statistics.map((st) => (
                        <tr key={st.id}>
                          <td>#{st.display_order || st.id}</td>
                          <td style={{ fontSize: "1.2rem" }}>{st.icon || "📊"}</td>
                          <td className={styles.nameCell}>{st.label}</td>
                          <td className={styles.budgetCell}>{st.prefix || ""}{st.value}{st.suffix || ""}</td>
                          <td>
                            <div className={styles.actionBtns}>
                              <button
                                className={`${styles.btnSm} ${styles.btnEdit}`}
                                onClick={() => {
                                  setEditingStat(st);
                                  setStatForm({
                                    label: st.label,
                                    value: st.value,
                                    prefix: st.prefix || "",
                                    suffix: st.suffix || "",
                                    icon: st.icon || "📊",
                                    display_order: st.display_order || 1,
                                  });
                                  setStatModalOpen(true);
                                }}
                              >
                                Edit
                              </button>
                              <button className={`${styles.btnSm} ${styles.btnDelete}`} onClick={() => handleDeleteStat(st.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═════════════════════════════════════════
          MODALS & DIALOGS
         ═════════════════════════════════════════ */}

      {/* Booking View Detail Modal */}
      {selectedBooking && (
        <div className={styles.modalOverlay} onClick={() => setSelectedBooking(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Booking Details #{selectedBooking.id}</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedBooking(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <p><strong>Customer Name:</strong> {selectedBooking.customerName}</p>
              <p><strong>Email Address:</strong> {selectedBooking.email}</p>
              <p><strong>Phone Number:</strong> {selectedBooking.phone}</p>
              <p><strong>Booking Date:</strong> {selectedBooking.date}</p>
              <p><strong>Time Slot:</strong> {selectedBooking.time}</p>
              <p><strong>Status:</strong> <span style={{ fontWeight: "bold", color: statusColor[selectedBooking.status] }}>{selectedBooking.status}</span></p>
              <p style={{ marginTop: "12px" }}><strong>Customer Message:</strong></p>
              <p style={{ background: "var(--surface-hover)", padding: "10px", borderRadius: "6px", fontSize: "14px" }}>
                {selectedBooking.message || "No additional message provided."}
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={`${styles.btnSm} ${styles.btnConfirm}`} onClick={() => handleUpdateBookingStatus(selectedBooking.id, "confirmed")}>
                Confirm Booking
              </button>
              <button className={`${styles.btnSm} ${styles.btnCancel}`} onClick={() => handleUpdateBookingStatus(selectedBooking.id, "cancelled")}>
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Booking Confirmation Dialog */}
      {deleteBookingId !== null && (
        <div className={styles.modalOverlay} onClick={() => setDeleteBookingId(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Confirm Delete</h3>
              <button className={styles.closeBtn} onClick={() => setDeleteBookingId(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to delete Booking #{deleteBookingId}? This action cannot be undone.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.filterInput} onClick={() => setDeleteBookingId(null)}>Cancel</button>
              <button className={`${styles.btnSm} ${styles.btnDelete}`} onClick={() => handleDeleteBooking(deleteBookingId)}>
                Yes, Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slot Modal */}
      {slotModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setSlotModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingSlot ? "Edit Slot" : "Add Time Slot"}</h3>
              <button className={styles.closeBtn} onClick={() => setSlotModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSaveSlot}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Start Time (e.g. 10:00 AM)</label>
                  <input
                    className={styles.formInput}
                    value={slotForm.start_time}
                    onChange={(e) => setSlotForm({ ...slotForm, start_time: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>End Time (e.g. 11:00 AM)</label>
                  <input
                    className={styles.formInput}
                    value={slotForm.end_time}
                    onChange={(e) => setSlotForm({ ...slotForm, end_time: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Day Configuration</label>
                  <select
                    className={styles.formSelect}
                    value={slotForm.day_of_week}
                    onChange={(e) => setSlotForm({ ...slotForm, day_of_week: e.target.value })}
                  >
                    <option value="all">All Days</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                  </select>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.filterInput} onClick={() => setSlotModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary}>Save Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Portfolio Modal */}
      {portfolioModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setPortfolioModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingPortfolio ? "Edit Project" : "Add Portfolio Project"}</h3>
              <button className={styles.closeBtn} onClick={() => setPortfolioModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSavePortfolio}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Project Title</label>
                  <input
                    className={styles.formInput}
                    value={portfolioForm.title}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={3}
                    value={portfolioForm.description}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <input
                    className={styles.formInput}
                    value={portfolioForm.category}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Technologies (comma separated)</label>
                  <input
                    className={styles.formInput}
                    value={portfolioForm.technologies}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, technologies: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Image URL</label>
                  <input
                    className={styles.formInput}
                    value={portfolioForm.image_url}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, image_url: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.filterInput} onClick={() => setPortfolioModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary}>Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Website Plan Modal */}
      {planModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setPlanModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingPlan ? "Edit Plan" : "Add Website Plan"}</h3>
              <button className={styles.closeBtn} onClick={() => setPlanModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSavePlan}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Plan Title</label>
                  <input
                    className={styles.formInput}
                    value={planForm.title}
                    onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Price (₹)</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Features List (One feature per line)</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={4}
                    value={planForm.featuresText}
                    onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.filterInput} onClick={() => setPlanModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary}>Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistic Modal */}
      {statModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setStatModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingStat ? "Edit Statistic" : "Add Statistic"}</h3>
              <button className={styles.closeBtn} onClick={() => setStatModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSaveStat}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Label</label>
                  <input
                    className={styles.formInput}
                    value={statForm.label}
                    onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Value</label>
                  <input
                    className={styles.formInput}
                    value={statForm.value}
                    onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Suffix (e.g. + or %)</label>
                    <input
                      className={styles.formInput}
                      value={statForm.suffix}
                      onChange={(e) => setStatForm({ ...statForm, suffix: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Icon Emoji</label>
                    <input
                      className={styles.formInput}
                      value={statForm.icon}
                      onChange={(e) => setStatForm({ ...statForm, icon: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.filterInput} onClick={() => setStatModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary}>Save Statistic</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
