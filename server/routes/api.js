const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const db = "mongodb+srv://admin:admin@authenication-r9s5u.mongodb.net/test?authSource=admin&replicaSet=authenication-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true";
// mongoose.Promise = global.Promise;

mongoose.connect(db, function (err) {
  if (err) {
    console.error("Error! " + err);
  } else {
    console.log("Connected to mongodb");
  }
});

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.userId = payload.subject;
  next();
}

router.get("/products", (req, res) => {
  let data = [
    {
      _id: "1",
      name: "toyota",
      description: "camry",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "2",
      name: "toyota",
      description: "yard",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "3",
      name: "toyota",
      description: "fortune",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "4",
      name: "toyota",
      description: "hilux",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "5",
      name: "toyota",
      description: "land cruiser",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "6",
      name: "toyota",
      description: "vios",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
  ];
  res.json(data);
});

router.get("/product-detail", verifyToken, (req, res) => {
  let data = [
    {
      _id: "1",
      name: "toyota",
      description: "camry",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "2",
      name: "toyota",
      description: "yard",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "3",
      name: "toyota",
      description: "fortune",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "4",
      name: "toyota",
      description: "hilux",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "5",
      name: "toyota",
      description: "land cruiser",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
    {
      _id: "6",
      name: "toyota",
      description: "vios",
      price: 1200,
      date: "2012-04-23T18:25:43.511Z",
    },
  ];
  res.json(data);
});

router.post("/register", (req, res) => {
  let userData = req.body;
  let user = new User(userData);
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err);
    } else {
      let payload = { subject: registeredUser._id };
      let token = jwt.sign(payload, "secretKey");
      res.status(200).send({ token });
    }
  });
});

router.post("/login", (req, res) => {
  let userData = req.body;
  User.findOne({ email: userData.email }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (!user) {
        res.status(401).send("Invalid Email");
      } else if (user.password !== userData.password) {
        res.status(401).send("Invalid Password");
      } else {
        let payload = { subject: user._id };
        let token = jwt.sign(payload, "secretKey");
        res.status(200).send({ token });
      }
    }
  });
});

module.exports = router;
