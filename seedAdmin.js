// seedAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedAdmin = async () => {
  const adminExists = await Admin.findOne({ email: "surajcomputershop@gmail.com" });

  if (adminExists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("SurajComputer123", 10);

  await Admin.create({
    email: "surajcomputershop@gmail.com",
    password: hashedPassword,
  });

  console.log("Admin created successfully");
  process.exit();
};

seedAdmin();
