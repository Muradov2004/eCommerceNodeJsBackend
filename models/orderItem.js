const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ['Pending', 'Canceled', 'Completed'], default: 'Pending' },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;
