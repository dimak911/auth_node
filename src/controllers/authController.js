const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { JWT_SECRET } = require("../config");

const generateAccessToken = (id, roles) => {
  const payload = { id, roles };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Registration error", errors });
      }
      const { username, password } = req.body;

      const candidate = await User.findOne({ username });

      if (candidate) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const userRole = await Role.findOne({ value: "USER" });
      const user = await User.create({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });

      return res.json({ message: "User successfully registered" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json("No such user");
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const token = generateAccessToken(user._id, user.roles);

      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login  error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();

      res.json(users);
    } catch (e) {}
  }
}

module.exports = new authController();
