const {
  getAll,
  create,
  getOne,
  remove,
  update,
  verifyCode,
  login,
  getLoggedUser,
} = require("../controllers/user.controllers");
const express = require("express");

const userRouter = express.Router();

const verifyJWT = require("../utils/verifyJWT");

userRouter.route("/users").get(verifyJWT, getAll).post(create);

userRouter.route("/users/verify/:code").get(verifyCode);

userRouter.route("/users/login").post(login);
userRouter.route("/users/me").get(verifyJWT, getLoggedUser);

userRouter
  .route("/users/:id")
  .get(verifyJWT, getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, update);

module.exports = userRouter;
