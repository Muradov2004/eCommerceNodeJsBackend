require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("connected to Database"))
  .catch((err) => console.error("Error connecting to Database", err));

app.use("/order", orderRoutes);
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/user", userRoutes);

port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
