/**
 * Email notifier for new leads.
 *
 * - Lazy-initializes the Resend client so the server boots even when
 *   RESEND_API_KEY is unset (notifications are an optional feature).
 * - Fire-and-forget: never blocks the API response and never throws.
 *   The lead is already persisted; an email failure must not surface
 *   as an HTTP 500 to the form submitter.
 */

const { Resend } = require("resend");

let resendClient = null;
function getResendClient() {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  resendClient = new Resend(apiKey);
  return resendClient;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label, value) {
  if (value === null || value === undefined || value === "") return "";
  return (
    `<tr>` +
    `<td style="padding:6px 14px 6px 0;color:#6b7280;font-weight:500;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>` +
    `<td style="padding:6px 0;color:#0f172a;">${escapeHtml(value)}</td>` +
    `</tr>`
  );
}

function detailsBlock(summary, payload) {
  if (!payload) return "";
  const json = JSON.stringify(payload, null, 2);
  return (
    `<details style="margin-top:14px;">` +
    `<summary style="cursor:pointer;color:#475569;font-size:13px;font-weight:500;">${escapeHtml(summary)}</summary>` +
    `<pre style="background:#f4f4f5;padding:12px;border-radius:8px;overflow:auto;font-size:12px;line-height:1.5;margin-top:8px;color:#0f172a;">${escapeHtml(json)}</pre>` +
    `</details>`
  );
}

function formatINR(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return `₹${value.toLocaleString("en-IN")}`;
}

function buildHtml(lead) {
  const heading = `New lead: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`;
  const created = new Date(lead.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const rows = [
    row("Name", lead.name),
    row("Email", lead.email),
    row("Company", lead.company),
    row("Lead score", `${lead.leadScore} / 100`),
    row("Source section", lead.sourceSection),
    row("Selected pain point", lead.selectedPainPoint),
    row("Pain points", lead.painPoints),
    row("Recommended automation", lead.recommendedAutomation),
    row("Estimated monthly loss", formatINR(lead.roiMonthlyLoss)),
    row("Submitted", created),
  ]
    .filter(Boolean)
    .join("");

  const extras = [
    detailsBlock("ROI calculator details", lead.roiPayload),
    detailsBlock("Audit quiz answers", lead.quizAnswers),
    detailsBlock("UTM tracking", lead.utmCampaign),
  ]
    .filter(Boolean)
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a;background:#f8fafc;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:#00C092;color:#ffffff;padding:18px 22px;border-radius:14px 14px 0 0;">
      <div style="font-size:11px;font-weight:600;letter-spacing:1.5px;opacity:0.85;">KHUSHAL AUTOMATION AGENCY</div>
      <div style="font-size:18px;font-weight:700;margin-top:6px;line-height:1.3;">${escapeHtml(heading)}</div>
    </div>
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 14px 14px;padding:18px 22px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5;">
        <tbody>${rows}</tbody>
      </table>
      ${extras}
      <div style="margin-top:20px;padding-top:14px;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280;">
        Reply directly to this email — your reply goes to <strong>${escapeHtml(lead.email)}</strong>.
      </div>
    </div>
  </div>
</body>
</html>`;
}

function buildText(lead) {
  const heading = `New lead: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`;
  const lines = [
    heading,
    "=".repeat(Math.min(heading.length, 60)),
    "",
    `Name:                ${lead.name}`,
    `Email:               ${lead.email}`,
    lead.company ? `Company:             ${lead.company}` : null,
    `Lead score:          ${lead.leadScore} / 100`,
    lead.sourceSection ? `Source section:      ${lead.sourceSection}` : null,
    lead.selectedPainPoint
      ? `Selected pain point: ${lead.selectedPainPoint}`
      : null,
    lead.painPoints ? `Pain points:         ${lead.painPoints}` : null,
    lead.recommendedAutomation
      ? `Recommended:         ${lead.recommendedAutomation}`
      : null,
    typeof lead.roiMonthlyLoss === "number"
      ? `Monthly loss (INR):  ${formatINR(lead.roiMonthlyLoss)}`
      : null,
    `Submitted:           ${new Date(lead.createdAt).toLocaleString("en-IN")}`,
    "",
    `Reply directly to this email to respond to ${lead.email}.`,
  ].filter(Boolean);
  return lines.join("\n");
}

function notifyNewLead(lead) {
  const client = getResendClient();
  if (!client) {
    console.log("[notifyLead] RESEND_API_KEY not set — skipping email.");
    return;
  }

  const to = process.env.LEADS_NOTIFICATION_TO;
  const from =
    process.env.LEADS_NOTIFICATION_FROM ||
    "Khushal Automation <onboarding@resend.dev>";

  if (!to) {
    console.warn(
      "[notifyLead] LEADS_NOTIFICATION_TO not set — skipping email.",
    );
    return;
  }

  const subject = `New lead: ${lead.name}${
    lead.company ? ` from ${lead.company}` : ""
  } — score ${lead.leadScore}/100`;

  // Fire-and-forget. Failure is logged but never propagated to the API caller.
  client.emails
    .send({
      from,
      to: [to],
      replyTo: lead.email,
      subject,
      html: buildHtml(lead),
      text: buildText(lead),
    })
    .then((result) => {
      if (result.error) {
        console.error("[notifyLead] Resend rejected the send:", result.error);
        return;
      }
      console.log(
        `[notifyLead] sent for lead ${lead.id} (Resend id: ${result.data?.id})`,
      );
    })
    .catch((err) => {
      console.error("[notifyLead] Unexpected error sending email:", err);
    });
}

module.exports = { notifyNewLead };
