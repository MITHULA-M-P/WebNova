const nodemailer = require("nodemailer");

// Create reusable transporter
let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const companyInfo = {
  name: "WebNova Studio",
  email: process.env.CONTACT_EMAIL || "contact@webnova.in",
  phone: process.env.CONTACT_PHONE || "+91 98765 43210",
  website: process.env.SITE_URL || "http://localhost:5173",
};

/**
  * Wrapper to send HTML emails with graceful fallback to console logging
  */
async function sendMail({ to, subject, html }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"${companyInfo.name}" <${companyInfo.email}>`,
    to,
    subject,
    html,
  };

  try {
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Sent] Subject: "${subject}" to: ${to} (MessageId: ${info.messageId})`);
      return info;
    } else {
      console.log(`\n=================== [MOCK EMAIL SENT] ===================`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body Snippet: ${html.substring(0, 300).replace(/<[^>]*>?/gm, "")}...`);
      console.log(`=========================================================\n`);
      return { mock: true };
    }
  } catch (error) {
    console.error(`[Email Error] Failed to send email to ${to}:`, error.message);
  }
}

/**
  * Send email when a booking is created
  */
async function sendBookingConfirmationEmail(booking) {
  const customerName = booking.customer?.business_name || "Valued Client";
  const customerEmail = booking.customer?.email;
  const date = booking.booking_date;
  const time = booking.booking_time;
  const bookingId = booking.id;

  // 1. Customer Email Template
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="color: #2563eb; margin: 0;">✦ ${companyInfo.name}</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Discovery Call Scheduled</p>
      </div>

      <div style="padding: 24px 0;">
        <h3 style="color: #0f172a; margin-top: 0;">Hi ${customerName},</h3>
        <p style="color: #334155; line-height: 1.6;">
          Thank you for scheduling a discovery call with WebNova! We are excited to learn more about your project goals.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #1e3a8a; font-size: 15px;">Appointment Details</h4>
          <p style="margin: 6px 0; color: #334155; font-size: 14px;">📅 <strong>Date:</strong> ${date}</p>
          <p style="margin: 6px 0; color: #334155; font-size: 14px;">⏰ <strong>Time:</strong> ${time}</p>
          <p style="margin: 6px 0; color: #334155; font-size: 14px;">🔖 <strong>Reference ID:</strong> #${bookingId}</p>
          <p style="margin: 6px 0; color: #334155; font-size: 14px;">🟡 <strong>Status:</strong> Pending Confirmation</p>
        </div>

        <p style="color: #334155; line-height: 1.6;">
          Our team will review your details and send you a calendar link shortly. If you need to change your time slot, please reply directly to this email or call us.
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b; text-align: center;">
        <p style="margin: 4px 0;"><strong>${companyInfo.name}</strong></p>
        <p style="margin: 4px 0;">Email: ${companyInfo.email} | Phone: ${companyInfo.phone}</p>
      </div>
    </div>
  `;

  if (customerEmail) {
    await sendMail({
      to: customerEmail,
      subject: `[WebNova] Booking Received - #${bookingId} (${date} at ${time})`,
      html: customerHtml,
    });
  }

  // 2. Admin Alert Email Template
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || companyInfo.email;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h3 style="color: #2563eb;">⚡ New Discovery Call Booking Alert</h3>
      <p style="color: #334155;">A new call has been booked on WebNova:</p>
      <ul style="color: #334155; line-height: 1.8;">
        <li><strong>Customer:</strong> ${customerName}</li>
        <li><strong>Email:</strong> ${customerEmail}</li>
        <li><strong>Phone:</strong> ${booking.customer?.phone || "N/A"}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time Slot:</strong> ${time}</li>
        <li><strong>Message:</strong> ${booking.message || "None"}</li>
      </ul>
      <p><a href="${companyInfo.website}/admin/dashboard" style="background-color: #2563eb; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; display: inline-block;">Open Admin Dashboard</a></p>
    </div>
  `;

  await sendMail({
    to: adminEmail,
    subject: `🔔 New Booking Alert: ${customerName} (${date} @ ${time})`,
    html: adminHtml,
  });
}

/**
  * Send email when booking status changes (e.g. Confirmed, Cancelled, Rescheduled)
  */
async function sendBookingStatusUpdateEmail(booking, actionType = "update") {
  const customerName = booking.customer?.business_name || "Valued Client";
  const customerEmail = booking.customer?.email;
  if (!customerEmail) return;

  let title = "Booking Status Updated";
  let badgeColor = "#2563eb";
  let statusText = booking.status.toUpperCase();
  let messageBody = `Your booking reference <strong>#${booking.id}</strong> has been updated to <strong>${booking.status}</strong>.`;

  if (booking.status === "confirmed" || actionType === "confirmed") {
    title = "🎉 Booking Confirmed!";
    badgeColor = "#10b981";
    messageBody = `Great news! Your discovery call scheduled for <strong>${booking.booking_date} at ${booking.booking_time}</strong> has been <strong>CONFIRMED</strong> by our team.`;
  } else if (booking.status === "cancelled" || actionType === "cancelled") {
    title = "Booking Cancelled";
    badgeColor = "#ef4444";
    messageBody = `Your discovery call scheduled for <strong>${booking.booking_date} at ${booking.booking_time}</strong> has been cancelled. Please reach out if you would like to reschedule.`;
  } else if (actionType === "rescheduled") {
    title = "Booking Rescheduled";
    badgeColor = "#f59e0b";
    messageBody = `Your discovery call has been rescheduled to <strong>${booking.booking_date} at ${booking.booking_time}</strong>.`;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="color: #2563eb; margin: 0;">✦ ${companyInfo.name}</h2>
      </div>

      <div style="padding: 20px 0;">
        <h3 style="color: #0f172a;">${title}</h3>
        <p style="color: #334155; line-height: 1.6;">Hi ${customerName},</p>
        <p style="color: #334155; line-height: 1.6;">${messageBody}</p>

        <div style="background-color: #f8fafc; border-left: 4px solid ${badgeColor}; padding: 14px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 4px 0; color: #334155;"><strong>Date:</strong> ${booking.booking_date}</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Time:</strong> ${booking.booking_time}</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Status:</strong> <span style="color: ${badgeColor}; font-weight: bold;">${statusText}</span></p>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #64748b; text-align: center;">
        <p style="margin: 4px 0;">${companyInfo.name} - ${companyInfo.phone} - ${companyInfo.email}</p>
      </div>
    </div>
  `;

  await sendMail({
    to: customerEmail,
    subject: `[WebNova] ${title} - #${booking.id}`,
    html,
  });
}

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
};
