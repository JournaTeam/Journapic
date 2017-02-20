/*jshint esversion:6*/
const express = require('express');
const authController = express.Router();
const User = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

/* GET home page. */
authController.get('/signup', function(req, res, next) {
  res.render('auth/signup');
});

authController.post("/signup", (req, res, next) => {
  var username = req.body.email;
  var password = req.body.password;

    if (username === "" || password === "") {
      res.render("auth/signup", { message: "Please indicate username and password" });
      return;
    }

    User.findOne({ username }, "username", (err, user) => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }

      var salt     = bcrypt.genSaltSync(bcryptSalt);
      var hashPass = bcrypt.hashSync(password, salt);

      var newUser = User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { message: "The username already exists" });
        } else {
          res.redirect("/login");
        }
      });
    });
  });

  module.exports = authController;
