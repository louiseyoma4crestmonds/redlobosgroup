import { Router } from "express";
import { sendContactEnquiryEmail } from "../email";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, phone, subject, message, terms } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
    terms?: boolean;
  };

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    res.status(400).json({ error: "name, email, subject and message are required." });
    return;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email.trim())) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  try {
    await sendContactEnquiryEmail({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    res.json({ ok: true });
  } catch (err: any) {
    console.error("Contact email error:", err.message);
    res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

export default router;
