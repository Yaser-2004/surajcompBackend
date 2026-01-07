import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/enquiry", enquiryRoutes);


// Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`🔥 Server running on port ${PORT}`)
);

//yasersiddiquee_db_user
//purvupyxxj6PfE8E
