// we import it
const userRouter = require("./user.router");
const express = require("express");
const router = express.Router();

// put the routes here
router.use(userRouter); // we execute it
module.exports = router;

//  SEQUELIZE: <--- Routes <-> Controller <-> Model

//  POSTMAN: workspaces -> collections -> requests
