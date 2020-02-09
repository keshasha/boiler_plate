const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 1. client cookie 에서 Token을 가져옴
  let token = req.cookies.x_auth;
  // 2. Token 을 복호화한 후 user 찾음
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
