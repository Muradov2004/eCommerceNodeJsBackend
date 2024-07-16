const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

const router = express.Router();

router.post("/register", async (req, res) => {
    try{
        const { username, email, password, isAdmin } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ username, email, passwordHash, isAdmin });
        await user.save();
        res.status(201).send({ message : "success"});
    } catch (error){
        res.status(500).send("error");
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(400).send("invalid password or email");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if(!validPassword) {
        return res.status(400).send("invalid password or email");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ accessToken, refreshToken });
});


router.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    if(!refreshToken) {
        return res.status(401).send("token not found");
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken(user);
        res.json({ accessToken: accessToken});
    });
});

module.exports = router;