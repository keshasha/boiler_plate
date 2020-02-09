const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// application/x-www-form-urlencoded 분석하여 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 분석하여 가져옴
app.use(bodyParser.json());

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
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
