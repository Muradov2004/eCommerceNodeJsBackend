require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const cluster = require("cluster");
const os = require("os");

const app = express();
app.use(express.json());
app.use(cors());

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  console.log(`Master ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });
} else {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("connected to Database"))
    .catch((err) => console.error("Error connecting to Database", err));

  app.use("/order", orderRoutes);
  app.use("/auth", authRoutes);
  app.use("/product", productRoutes);
  app.use("/user", userRoutes);
  app.use("/basket", basketRoutes);
  
  port = 5000;
  app.listen(port, () => {
    console.log(`Worker ${process.pid} running on port ${port}`);
  });
}
