const express = require("express");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  validateForm(req, res);
  const potentialLogin = await pool.query(
    "SELECT id, username, pashHash FROM users u where u.username = $1",
    [req.body.username]
  );

  if (potentialLogin.rowCount) {
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
      res.json({
        loggedIn: false,
        status: "Wrong username or password!",
      });
    }
  } else {
    res.json({
      loggedIn: false,
      status: "Wrong username or password!",
    });
  }
});

router.post("/signup", async (req, res) => {
  validateForm(req, res);
  const existingUser = await pool.query("SELECT username FROM users WHERE $1", [
    req.body.username,
  ]);

  if (existingUser.rowCount === 0) {
    //register
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await pool.query(
      "INSERT INTO users (username, passhash) VALUES ($1, $2) RETURNING username",
      [req.body.username, hashedPassword]
    );
    console.log(newUserQuery);
    req.session.user = {
      username: req.body.username,
      id: newUser.rows[0].id,
    };
    res.json({
      loggedIn: true,
      username: req.body.username,
    });
  } else {
    res.json({
      loggedIn: false,
      status: "Username taken",
    });
  }
});

module.exports = router;
