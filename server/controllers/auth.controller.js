const authService = require("../services/auth.service");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    err.status = 401;
    next(err);
  }
}

module.exports = {
  login,
};
