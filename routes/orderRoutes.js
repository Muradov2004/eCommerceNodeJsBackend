const express = require("express");
const Order = require("../models/orderItem");
const { authorize } = require("../middlewares/authorize");

const router = express.Router();

router.get("/", authorize, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", authorize, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) res.json(order);
    else res.status(404).json({ message: "order not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/delete/:id", authorize, async (req, res) => {
  try {
    const status = await Order.findByIdAndDelete(req.params.id);
    if (status) res.json("deleted");
    else res.json("error");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/create", authorize, async (req, res) => {
  try {
    const { product, quantity, price } = req.body;
    const newOrder = new Order({
      product,
      quantity,
      price,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/edit/:id", authorize, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
      product: req.body.product,
      quantity: req.body.quantity,
      price: req.body.price,
    });

    if (updatedOrder) res.json(updatedOrder);
    else res.status(404).json({ message: "order not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
