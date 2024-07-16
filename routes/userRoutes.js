const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authorize } = require("../middlewares/authorize");
const { checkAdmin } = require("../middlewares/checkAdmin");

router.get("/", authorize, checkAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", authorize, checkAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (user) res.json(user);
    else res.status(404).json({ message: "user not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/delete/:id", authorize, checkAdmin, async (req, res) => {
  try {
    const status = await User.findByIdAndDelete(req.params.id);
    if (status) res.json("deleted");
    else res.json("error");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// edit
router.put("/edit/:id", authorize, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
    });

    if (updatedUser) res.json(updatedUser);
    else res.status(404).json({ message: "not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
