const express = require("express");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const chatRoute = require("./chatRoute");
const messageRoutes = require("./messageRoute");
const postRoute = require("./postRoute");
const commentRoute = require("./commentRoute");
const notificationRoute = require("./notificationRoute");

const adminManagerRoute = require("./adminManagerRoute");

let initRoutes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/chat", chatRoute);
  app.use("/api/message", messageRoutes);
  app.use("/api/post", postRoute);
  app.use("/api/comment", commentRoute);
  app.use("/api/notification", notificationRoute);

  // Admin
  app.use("/api/adminManager", adminManagerRoute);
  return app;
};

module.exports = initRoutes;
