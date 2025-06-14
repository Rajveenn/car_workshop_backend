const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email.
    const user = await User.findOne({ email });

    // 2. Security Improvement: If the user doesn't exist or is not an admin,
    // we should not proceed. However, we return a generic error message
    // to prevent revealing whether the email exists in the database.
    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Securely compare the provided password with the stored hash.
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, send the same generic error.
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. If all checks pass, prepare the JWT payload.
    // Including `isAdmin` in the token can be useful for protecting other routes.
    const payload = {
      email: user.email,
      id: user._id,
      isAdmin: user.isAdmin,
    };

    // 5. Sign the token.
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 6. Send the token with a 200 OK status.
    res.status(200).json({ token });
    
  } catch (error) {
    // 7. Robustness: Catch any unexpected server errors.
    console.error("Login error:", error); // Log the error for your records.
    res.status(500).json({ message: "An internal server error occurred." });
  }
});

module.exports = router;