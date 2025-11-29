import "./config/dotenv.js";
import db from "./config/db.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
// CHỈ LOAD ADMIN ROUTES THEO YÊU CẦU
import adminRoutes from "./routes/admin/adminRoutes.js";
import authRoutes from "./routes/user/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Admin routes
app.use("/api/admin", adminRoutes);
// Auth route (chỉ bật login để phục vụ admin)
app.use("/api/user/auth", authRoutes);
// TẠM THỜI KHÔNG LOAD USER/MANAGER ROUTES ĐỂ TRÁNH XUNG ĐỘT

app.get("/", (req, res) => {
  res.json({ status: "Football Backend Running!" });
});

// Test kết nối Database
db.getConnection()
  .then(() => console.log("MySQL connected successfully!"))
  .catch((err) => console.error("MySQL connection error:", err));

export default app;
