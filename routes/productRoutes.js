const express = require("express");
const Product = require("../models/product");
const { authorize } = require("../middlewares/authorize");
const { checkAdmin } = require("../middlewares/checkAdmin");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "product not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/edit/:id", authorize, checkAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      imageUrl: req.body.imageUrl,
    });
    if (updatedProduct) res.json(updatedProduct);
    else res.status(404).json({ message: "product not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete(
  "/delete/:id",
  authorize,
  checkAdmin,
  async (req, res) => {
    try {
      const status = await Product.findByIdAndDelete(req.params.id);
      if (status) res.json("deleted");
      else res.json("error");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.post("/create", authorize, checkAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
