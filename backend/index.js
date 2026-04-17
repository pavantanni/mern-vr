const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

// FIXED: Better CORS for deployment
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });

app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

// FIXED: Dynamic Port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));
