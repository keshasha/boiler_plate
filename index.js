const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// application/x-www-form-urlencoded 분석하여 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 분석하여 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

const config = require("./config/key");

const { User } = require("./models/User");

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("hello world"));

app.post("/register", (req, res) => {
  // 회원 가입 정보를 client에서 가져오면,
  // DB에 저장

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post("/login", (req, res) => {
  // 1. 요청된 이메일이 DB에 있는지 확인
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Email이 존재하지 않습니다."
      });
    } else {
      // 2. 비밀번호 확인
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다."
          });
        else {
          // 3. User Token 생성
          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            // 4. Save the Token
            res
              .cookie("x_auth", user.token)
              .status(200)
              .json({ loginSuccess: true, userID: user._id });
          });
        }
      });
    }
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
