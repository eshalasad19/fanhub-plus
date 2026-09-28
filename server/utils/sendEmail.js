import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    
    family: 4,
    
    tls: process.env.NODE_ENV === "production" ? undefined : { rejectUnauthorized: false },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, text, html }) => {
  const client = getTransporter();

  if (!client) {
    console.warn("[sendEmail] GMAIL_USER / GMAIL_APP_PASSWORD not set — email not sent, logging instead.");
    console.log("\n──────── Email (not configured) ────────");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log(text || html);
    console.log("──────────────────────────────────────────\n");
    return { delivered: false, loggedOnly: true };
  }

  const info = await client.sendMail({
    from: `"Fan Hub Plus" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  return { delivered: true, messageId: info.messageId };
};

export default sendEmail;