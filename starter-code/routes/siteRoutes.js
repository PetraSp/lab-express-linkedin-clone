var express = require('express');
const siteRoutes = express.Router();



siteRoutes.get("/", (req, res, next) => {
  res.render("site/index");
});



module.exports = siteRoutes;
