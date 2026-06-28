require("dotenv").config();

const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const subscriptionRoutes = require("./src/routes/subscription.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server tigtly bound and started on the Port ${PORT}`);
  });
};

startServer();
