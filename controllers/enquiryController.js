import sendEmail from "../config/mailer.js";

export const sendEnquiry = async (req, res) => {
  const { name, mobile, email, service, message } = req.body;

  if (!name || !mobile || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const emailContent = `
    New Enquiry Received

    Name: ${name}
    Mobile: ${mobile}
    Email: ${email || "N/A"}
    Service: ${service || "N/A"}

    Message:
    ${message}
  `;

  await sendEmail(
    process.env.EMAIL_USER,
    "New Website Enquiry - Suraj Computer",
    emailContent
  );

  res.json({ message: "Enquiry sent successfully" });
};
