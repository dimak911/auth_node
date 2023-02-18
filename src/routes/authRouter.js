const Router = require("express");
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = new Router();

router.post(
  "/registration",
  [
    check("username", "Username can not be empty").notEmpty(),
    check("password", "Password must at least 8 characters long").isLength({
      min: 8,
    }),
  ],
  authController.registration
);
router.post("/login", authController.login);
router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  authController.getUsers
);

module.exports = router;
