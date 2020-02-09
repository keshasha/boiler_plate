const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

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
    maxlength: 80
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

// save 이전 preprocess
userSchema.pre("save", function(next) {
  var user = this;
  // password 가 변환 될때만
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return next(err);
      else {
        bcrypt.hash(user.password, salt, function(err, hashed) {
          if (err) return next(err);
          else {
            user.password = hashed;
            next();
          }
        });
      }
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    else callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function(callback) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function(err, user) {
    if (err) return callback(err);
    else return callback(null, user);
  });
};

const User = mongoose.model("User", userSchema);

// 외부 파일에서 사용하기 위함
module.exports = { User };
