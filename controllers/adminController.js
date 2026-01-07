import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../config/mailer.js"; // optional

// LOGIN
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin){
        console.log("error1");
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        console.log("error2");
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    res.json({ token });
  } catch (err) {
    console.error("Invalid credentials", err);
  }
};

// FORGOT PASSWORD (GENERATE TOKEN)
export const forgotPassword = async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin)
    return res.status(404).json({ message: "Admin not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");

  admin.resetToken = resetToken;
  admin.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await admin.save();

//   const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const resetLink = `http://localhost:8080/reset-password/${resetToken}`;

  // Send email (or console.log during dev)
  await sendEmail(
    admin.email,
    "Reset your password",
    `Click to reset: ${resetLink}`
  );

  res.json({ message: "Password reset link sent to email" });
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const admin = await Admin.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!admin)
    return res.status(400).json({ message: "Invalid or expired token" });

  admin.password = req.body.password;
  admin.resetToken = undefined;
  admin.resetTokenExpiry = undefined;
  await admin.save();

  res.json({ message: "Password updated successfully" });
};
