const express = require("express");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const chatRoute = require("./chatRoute");
const messageRoutes = require("./messageRoute");

let initRoutes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/chat", chatRoute);
  app.use("/api/message", messageRoutes);
  return app;
};

module.exports = initRoutes;
