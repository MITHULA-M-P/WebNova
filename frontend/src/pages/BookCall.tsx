import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createBooking, getAvailableSlots, type TimeSlot } from "../services/api";
import "../css/BookCall.css";

function BookCall() {
  const location = useLocation();
  const prepopulated = location.state as { email?: string; phone?: string; name?: string } | undefined;

  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: prepopulated?.name || "",
    email: prepopulated?.email || "",
    phone: prepopulated?.phone || "",
    date: todayStr,
    time: "",
    message: "",
  });

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);

  // Fetch slots whenever selected date changes
  useEffect(() => {
    if (!formData.date) return;
    setLoadingSlots(true);
    getAvailableSlots(formData.date)
      .then((data) => {
        setSlots(data);
        // Reset selected time if it's no longer available
        const currentSlot = data.find((s) => s.startTime === formData.time || s.display === formData.time);
        if (currentSlot && currentSlot.available === false) {
          setFormData((prev) => ({ ...prev, time: "" }));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingSlots(false));
  }, [formData.date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await createBooking(formData);
      setBookingId(response.id);
      setIsBooked(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to confirm booking. Please choose another date/time.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isBooked) {
    return (
      <section className="book-call-section page-content">
        <div className="book-call-container text-center" style={{ maxWidth: "550px" }}>
          <div className="success-icon" style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
          <h1>Booking Confirmed!</h1>
          <p style={{ color: "var(--muted)", margin: "16px 0 30px", fontSize: "16px" }}>
            Thank you, <strong>{formData.name}</strong>. Your discovery call has been successfully scheduled.
          </p>

          <div
            className="booking-summary-card"
            style={{
              background: "var(--surface-card, var(--background))",
              padding: "24px",
              borderRadius: "12px",
              textAlign: "left",
              border: "1px solid var(--border)",
              marginBottom: "32px"
            }}
          >
            <h3 style={{ marginBottom: "14px", fontSize: "16px", color: "var(--secondary)" }}>Call Details</h3>
            <p style={{ marginBottom: "8px", fontSize: "14px" }}>
              📅 <strong>Date:</strong> {formData.date}
            </p>
            <p style={{ marginBottom: "8px", fontSize: "14px" }}>
              ⏰ <strong>Time:</strong> {formData.time}
            </p>
            <p style={{ marginBottom: "8px", fontSize: "14px" }}>
              📞 <strong>Contact Phone:</strong> {formData.phone}
            </p>
            <p style={{ marginBottom: "8px", fontSize: "14px" }}>
              📧 <strong>Confirmation Email:</strong> {formData.email}
            </p>
            {bookingId && (
              <p style={{ fontSize: "14px", marginTop: "8px", color: "var(--primary)" }}>
                🔖 <strong>Booking Reference:</strong> #{bookingId}
              </p>
            )}
          </div>

          <a href="/" className="btn btn-primary" style={{ width: "100%" }}>
            Return to Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="book-call-section page-content">
      <div className="book-call-container">
        <h1>Book Discovery Call</h1>
        <p>
          Choose a suitable date and time to discuss your custom website build details.
        </p>

        {submitError && (
          <div className="booking-error" style={{ color: "#ef4444", marginBottom: "20px", fontWeight: "600", fontSize: "14px", textAlign: "center" }}>
            ⚠️ {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name-input">Full Name</label>
          <input
            id="name-input"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />

          <label htmlFor="email-input">Email Address</label>
          <input
            id="email-input"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />

          <label htmlFor="phone-input">Phone Number</label>
          <input
            id="phone-input"
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label htmlFor="date-input">Select Date</label>
              <input
                id="date-input"
                type="date"
                name="date"
                min={todayStr}
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="time-input">
                Select Time {loadingSlots && <span style={{ fontSize: "12px", color: "var(--muted)" }}>(loading slots…)</span>}
              </label>
              <select
                id="time-input"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
              >
                <option value="">Choose Time Slot</option>
                {slots.map((s) => {
                  const slotLabel = s.display || `${s.startTime} - ${s.endTime}`;
                  const val = s.startTime || slotLabel;
                  return (
                    <option key={s.id} value={val} disabled={s.available === false}>
                      {slotLabel} {s.available === false ? "(Unavailable)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <label htmlFor="msg-input">Additional Message (Optional)</label>
          <textarea
            id="msg-input"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us a little bit about your project..."
            style={{
              width: "100%",
              padding: "12px",
              border: "1.5px solid var(--border)",
              borderRadius: "8px",
              fontFamily: "inherit",
              fontSize: "14px",
              outline: "none",
              resize: "vertical",
              marginBottom: "20px"
            }}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Booking Appointment..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default BookCall;