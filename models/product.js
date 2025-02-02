const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Tech", "Clothing", "Cars"],
  },
  stock: { type: Number, required: true },
  gallery: { type: [String], required: true },
  currency: { type: String, enum: ["$", "AZN", "EUR"], default: "AZN"}
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
