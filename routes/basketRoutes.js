const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const { authorize } = require("../middleware/authorize");

router.get("/", authorize, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("basket");
    if (!user) return res.status(404).send("User not found");

    res.json(user.basket);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/add", authorize, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    const user = await User.findById(req.user.id);

    if (!product || !user) return res.status(404).send("not found");

    user.basket.push(productId);
    await user.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/remove/:productId", authorize, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("User not found");

    user.basket = user.basket.filter((item) => item.toString() !== productId);
    await user.save();

    res.send("deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
