const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  orders: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
