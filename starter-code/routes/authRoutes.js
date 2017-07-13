const express = require('express');
const User = require("../models/user");
const bcrypt     = require("bcrypt");
const saltRounds = 10;

const authRoutes = express.Router();
const passport = require("passport");


/* GET home page. */ //show form
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.get('/home', (req,res,next) => {
  res.render('home',{ user: req.user });
})


authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
  res.render("auth/signup", {
    errorMessage: "Indicate a username and a password to sign up"
  });
  return;
}

//We need to check out if the indicated username is already defined in the database before create a new one.
User.findOne({ "username": username }, 
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

const salt     = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(password, salt);
//creating an object
  const newUser  = User({
    username: username,
    password: hashPass
  });

//create a new user in the database
  newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
  });
      });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "../home",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = authRoutes;
