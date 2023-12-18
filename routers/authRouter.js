const express = require("express");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

router.post("/login", (req, res) => {
  validateForm(req, res);
});

router.post("/signup", (req, res) => {
  validateForm(req, res);
});

module.exports = router;
