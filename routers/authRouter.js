const express = require("express");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
// const { RESERVED_EVENTS } = require("socket.io/dist/socket")

router.post("/login", async (req, res) => {
  validateForm(req, res);

  const potentialLogin = await pool.query(
    "SELECT id, username, passhash FROM users u where u.username=$1",
    [req.body.username]
  );

  if (potentialLogin.rowCount > 0) {
    const isSamePass = bcrypt.compare(
      req.body.password,
      potentialLogin.rows[0].passhash
    );

    if (isSamePass) {
      //login
      req.session.user = {
        username: req.body.username,
        id: potentialLogin.rows[0].id,
      };
    } else {
      //bad login
      res.json({
        loggedIn: false,
        status: "Wrong username or password!",
      });
    }
  } 
  else {
    console.log(req);
  }
});

router.post("/signup", async (req, res) => {
  validateForm(req, res);

  const existingUser = await pool.query(
    "SELECT username FROM users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    //register
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    try {
      const newUser = await pool.query(
        "INSERT INTO users (username, passhash) VALUES ($1, $2) RETURNING id, username",
        [req.body.username, hashedPassword]
      );
      console.log(newUser);
      req.session.user = {
        username: req.body.username,
        id: newUser.rows[0].id,
      };
      res.json({
        loggedIn: true,
        username: req.body.username,
      });
    } catch (err) {
      console.error("Error registering user:", err);
      res.status(500).json({
        loggedIn: false,
        status: "Error registering user",
      });
    }
  } else {
    res.status(400).json({
      loggedIn: false,
      status: "Username taken",
    });
  }
});

module.exports = router;
