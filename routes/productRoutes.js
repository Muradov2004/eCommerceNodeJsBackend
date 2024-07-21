const express = require("express");
const Product = require("../models/product");
const { authorize } = require("../middlewares/authorize");
const { checkAdmin } = require("../middlewares/checkAdmin");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const item_count = parseInt(req.query.item_count) || 10;

    const skip = (page - 1) * item_count;
    const totalItems = await Product.countDocuments();
    const totalPages = Math.ceil(totalItems / item_count);

    const items = await Product.find().skip(skip).limit(item_count);
    res.json(items, page, totalPages);
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
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      images: req.body.images,
      currency: req.body.currency,
    });
    if (updatedProduct) res.json(updatedProduct);
    else res.status(404).json({ message: "product not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/delete/:id", authorize, checkAdmin, async (req, res) => {
  try {
    const status = await Product.findByIdAndDelete(req.params.id);
    if (status) res.json("deleted");
    else res.json("error");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/create", authorize, checkAdmin, async (req, res) => {
  try {
    const { title, description, price, category, stock, images, currency} = req.body;
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      stock,
      images,
      currency,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/search/:searchTerm", authorize, async (req, res) => {
  try{
      const searchTerm = req.params.searchTerm;
      const result = await Product.find({
          $or: [
              { title: { $regex: searchTerm, $options: "i" }},
              { description: { $regex: searchTerm, $options: "i"}},
          ],
      });

      res.json(result);
  } catch(err){
      res.status(500).json({ message: err.message });
  }
});

module.exports = router;
