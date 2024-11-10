const express = require("express");
const authRoute = require("./authRoute");

let initRoutes = (app) => {
  app.use("/api/auth", authRoute);

  return app;
};

module.exports = initRoutes;
