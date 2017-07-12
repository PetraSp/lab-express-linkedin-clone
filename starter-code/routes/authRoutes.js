var express = require('express');
const User = require("../models/user");
const bcrypt     = require("bcrypt");
const saltRounds = 10;

const authRoutes = express.Router();


/* GET home page. */ //show form
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt     = bcrypt.genSaltSync(saltRounds);
  var hashPass = bcrypt.hashSync(password, salt);

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

//creating an object
  var newUser  = User({
    username,
    password: hashPass
  });

//create a new user in the database
  newUser.save((err) => {
    if (err) throw err;
//If the user hasn't started a session, he should be redirected to /login page.
    res.redirect("/");
  });
      })
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/index");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});



authRoutes.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});


module.exports = authRoutes;