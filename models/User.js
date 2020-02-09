const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 30
  },
  email: {
    type: String,
    trim: true, // remove white space
    unique: 1
  },
  password: {
    type: String,
    maxlength: 30
  },
  // 사용자 유형
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  // token 유효기간
  tokenExp: {
    type: Number
  }
});

const User = mongoose.model("User", userSchema);

// 외부 파일에서 사용하기 위함
module.exports = { User };
